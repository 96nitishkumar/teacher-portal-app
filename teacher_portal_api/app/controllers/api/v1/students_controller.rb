class Api::V1::StudentsController < ApplicationController
  before_action :authorize_request

  def index
    @students = @current_teacher&.students
    render json: @students
  end

  def create
    student = @current_teacher.students.find_or_initialize_by(name: student_params[:name]&.downcase, subject: student_params[:subject]&.downcase)
    if student.new_record?
      student.marks = student_params[:marks]
    else
      new_marks = student_params[:marks].to_i
      total_marks = student.marks + new_marks
      if total_marks > 100
        return render json: { errors: { marks: "Total marks cannot exceed 100." } }, status: :unprocessable_entity
      end
      student.marks = total_marks
    end

    if student.save
      render json: student, status: :created
    else
      render json: student.errors, status: :unprocessable_entity
    end
  end

  def show 
    student = @current_teacher.students.find(params[:id])
    render json: student
  end

  def update
    student = @current_teacher.students.find(params[:id])
    new_marks = student_params[:marks].to_i
    if student.update(student_params)
      render json: student
    else
      render json: student.errors, status: :unprocessable_entity
    end
  end

  def destroy
    student = @current_teacher.students.find(params[:id])
    student.destroy
    head :no_content
  end

  private

  def student_params
    params.require(:student).permit(:name, :subject, :marks)
  end

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = JsonWebToken.decode(header)
    return render json: { errors: 'Token not found!', status: false }, status: 404 unless header
    @current_teacher = Teacher.find(decoded[:teacher_id]) if decoded
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    render json: { errors: 'Unauthorized' }, status: :unauthorized
  end
end
