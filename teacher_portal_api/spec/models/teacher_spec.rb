require 'rails_helper'

RSpec.describe Teacher, type: :model do
  describe 'associations' do
    it { should have_many(:students).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
    it { should allow_value('test@example.com').for(:email) }
    it { should_not allow_value('invalid_email').for(:email) }
  end

end
