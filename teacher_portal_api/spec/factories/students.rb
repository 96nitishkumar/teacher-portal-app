FactoryBot.define do
  factory :student do
    name { Faker::Name.name }
    subject { Faker::Educator.subject }
    marks { rand(0..100) }
    association :teacher
  end
end
