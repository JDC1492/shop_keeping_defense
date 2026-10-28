# frozen_string_literal: true

require "rails_helper"

# Fast, in-process regression specs. Owned by the dev.
# Example descriptions that start with a finding ID are pending while that ID is listed in
# findings/open-findings.json (see spec/support/open_findings.rb).
#
# Adjust the Order attributes below to match the dev's schema (see docs/API_CONTRACT.md).
RSpec.describe "Orders", type: :request do
  let(:alice) { create_user(email: "alice@example.test") }
  let(:bob)   { create_user(email: "bob@example.test") }

  let!(:alice_order) do
    Order.create!(user: alice, total_cents: 4599,
                  shipping_name: "Alice Example", shipping_address: "123 Alice Way, Faketown, ZZ 00001")
  end
  let!(:bob_order) do
    Order.create!(user: bob, total_cents: 1299,
                  shipping_name: "Bob Example", shipping_address: "456 Bob Street, Faketown, ZZ 00002")
  end

  # Control: no finding ID, so it always runs and must always pass.
  it "control: returns the caller's own order" do
    get "/api/orders/#{alice_order.id}", headers: auth_headers_for(alice)

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["id"]).to eq(alice_order.id)
  end

  it "VULN-003: returns 404 for another user's order" do
    get "/api/orders/#{bob_order.id}", headers: auth_headers_for(alice)

    expect(response).to have_http_status(:not_found)
    expect(response.body).not_to include(bob_order.shipping_address)
  end
end
