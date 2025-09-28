
import LoginForm from '../components/auth/LoginForm'
// import RegisterForm from '../components/auth/RegisterForm'

const AuthPage: React.FC = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 w-full max-w-lg">
          <LoginForm/>

      </div>
    </div>
  )
}

export default AuthPage