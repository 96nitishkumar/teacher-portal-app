require 'rails_helper'

RSpec.describe Api::V1::StudentsController, type: :controller do
  let!(:teacher) { create(:teacher) }
  let!(:token) { JsonWebToken.encode(teacher_id: teacher.id) }
  let!(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET #index' do
    it 'returns a list of students' do
      request.headers.merge!(headers) # Include headers
      get :index, params: {}
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST #create' do
    context 'when the student is new' do
      let(:student_params) { { name: 'John Doe', subject: 'Math', marks: 85 } }

      it 'creates a new student' do
        request.headers.merge!(headers) # Include headers
        post :create, params: { student: student_params }
        expect(response).to have_http_status(:created)
        expect(Student.last.name).to eq('john doe')
        expect(Student.last.subject).to eq('math')
        expect(Student.last.marks).to eq(85)
      end
    end

    context 'when the student already exists' do
      let!(:existing_student) { create(:student, name: 'John Doe', subject: 'Math', marks: 50, teacher: teacher) }
      let(:student_params) { { name: 'John Doe', subject: 'Math', marks: 40 } }

      it 'updates the existing student marks' do
        request.headers.merge!(headers) # Include headers
        post :create, params: { student: student_params }
        expect(response).to have_http_status(:created)
        expect(existing_student.reload.marks).to eq(50)
      end
    end
  end

  describe 'GET #show' do
    let!(:student) { create(:student, teacher: teacher) }

    it 'returns a student' do
      request.headers.merge!(headers) # Include headers
      get :show, params: { id: student.id }
      expect(response).to have_http_status(:ok)
      expect(json_response['name']).to eq(student.name)
    end
  end

  describe 'PUT #update' do
    let!(:student) { create(:student, teacher: teacher) }
    let(:updated_params) { { name: 'Jane Doe', marks: 50 } }

    it 'updates the student' do
      request.headers.merge!(headers) # Include headers
      put :update, params: { id: student.id, student: updated_params }
      expect(response).to have_http_status(:ok)
      expect(student.reload.name).to eq('Jane Doe')
    end

    it 'returns an error if the update is invalid' do
      request.headers.merge!(headers) # Include headers
      put :update, params: { id: student.id, student: { marks: -10 } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE #destroy' do
    let!(:student) { create(:student, teacher: teacher) }

    it 'deletes the student' do
      request.headers.merge!(headers) # Include headers
      expect {
        delete :destroy, params: { id: student.id }
      }.to change(Student, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end

    context 'when the token is missing' do
      it 'returns token not found error' do
        get :index, params: {}
        expect(response).to have_http_status(:not_found)
        expect(json_response['errors']).to eq('Token not found!')
      end
    end

  def json_response
    JSON.parse(response.body)
  end
end
