class Api::V1::AuthenticationController < ApplicationController
    def login
      @teacher = Teacher.find_by(email: params[:email]&.downcase)
      unless @teacher
        return render json: { error: 'Email is not registered. Please check your email' }, status: :not_found
      end

      if @teacher&.authenticate(params[:password])
        token = JsonWebToken.encode(teacher_id: @teacher.id)
        render json: { token: token }, status: :ok
      else
        render json: { error: 'Incorrect password. Please try again.' }, status: :unauthorized
      end
    end
  end
  