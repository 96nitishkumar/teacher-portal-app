require 'rails_helper'

RSpec.describe Student, type: :model do
  describe 'associations' do
    it { should belong_to(:teacher) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:subject) }
    it { should validate_presence_of(:marks) }
  end
end
