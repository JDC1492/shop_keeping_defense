# frozen_string_literal: true

require "json"

# findings/open-findings.json is the single source of truth for which findings are still
# vulnerable. Examples whose description starts with an open finding ID (for example
# "VULN-003: ...") are marked pending, so CI stays green while the bug exists.
#
# If the bug is fixed but the ID is still listed, the pending example passes, and RSpec reports
# that as a failure. That forces the fix PR to remove the ID.
module OpenFindings
  DEFAULT_PATH = File.expand_path("../../../findings/open-findings.json", __dir__)
  ID_PATTERN = /\A((?:VULN|A11Y)-\d+):/

  def self.path
    ENV.fetch("OPEN_FINDINGS_PATH", DEFAULT_PATH)
  end

  def self.ids
    @ids ||= JSON.parse(File.read(path)).fetch("open", [])
  end

  def self.open?(id)
    ids.include?(id)
  end

  def self.id_from(description)
    description[ID_PATTERN, 1]
  end
end

RSpec.configure do |config|
  config.before(:each) do |example|
    id = OpenFindings.id_from(example.description)
    pending("#{id} is open in findings/open-findings.json") if id && OpenFindings.open?(id)
  end
end
