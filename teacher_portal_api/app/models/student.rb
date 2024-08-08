class Student < ApplicationRecord
  belongs_to :teacher
  validates :name, :marks, :subject, presence: true
  validates :marks, numericality: { 
                      only_integer: true, 
                      greater_than_or_equal_to: 0, 
                      less_than_or_equal_to: 100, 
                      message: 'must be an integer between 0 and 100' 
                    }
end
