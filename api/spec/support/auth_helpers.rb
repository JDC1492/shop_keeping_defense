# frozen_string_literal: true

# Helpers for request specs. Adjust the User attributes if the dev's model differs
# (this assumes `has_secure_password` with email, password, role).
module AuthHelpers
  TEST_PASSWORD = "Password123!" # lab-only fake

  def create_user(email:, role: "user")
    User.create!(email: email, password: TEST_PASSWORD, role: role)
  end

  # Logs in through the real endpoint so specs exercise the same auth path as Playwright.
  def auth_headers_for(user)
    post "/api/login", params: { email: user.email, password: TEST_PASSWORD }, as: :json
    token = response.parsed_body.fetch("token")
    { "Authorization" => "Bearer #{token}" }
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
