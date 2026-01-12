'use client';

const Navbar = ({ onMenuClick, userName = 'User', userRole = 'Patient' }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={onMenuClick}
          >
            ☰
          </button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">HV</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">
              HealthVillage
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-gray-600">
            {userName} ({userRole})
          </span>

          <button className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
