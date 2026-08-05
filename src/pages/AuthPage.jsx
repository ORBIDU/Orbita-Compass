import StoryAnimation from '../components/StoryAnimation'
import LoginCard from '../components/LoginCard'

export default function AuthPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-space-1 to-space-2">
      {/* Left Panel — Story Animation (65%) */}
      <div className="hidden lg:block w-[65%] relative border-r border-cloud/10">
        <StoryAnimation />
      </div>

      {/* Right Panel — Login Card (35%) */}
      <div className="w-full lg:w-[35%] flex items-center justify-center relative">
        {/* Mobile background for small screens */}
        <div className="absolute inset-0 lg:hidden overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] rounded-full bg-orbit-1/10 blur-3xl" />
          <div className="absolute bottom-[15%] right-[10%] w-[150px] h-[150px] rounded-full bg-sun-1/10 blur-3xl" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orbit-2/5 blur-3xl" />
        </div>
        <div className="relative z-10 w-full">
          <LoginCard />
        </div>
      </div>
    </div>
  )
}
