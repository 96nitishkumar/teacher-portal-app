FactoryBot.define do
  factory :teacher do
    email { Faker::Internet.email }
    password { 'password' }
    password_confirmation { 'password' }
  end
end
