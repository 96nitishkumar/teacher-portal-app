class Api::V1::AuthenticationController < ApplicationController
    def login
      @teacher = Teacher.find_by(email: params[:email]&.downcase)
      if @teacher&.authenticate(params[:password])
        token = JsonWebToken.encode(teacher_id: @teacher.id)
        render json: { token: token }, status: :ok
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end
  end
  