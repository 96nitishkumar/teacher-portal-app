class Teacher < ApplicationRecord
  has_secure_password
  has_many :students, dependent: :destroy

  before_save :downcase_email

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: 'is not a valid email' }
  private
  def downcase_email
    self.email = email.downcase if email.present?
  end
end
