export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-blue-600/70 dark:bg-blue-800/70 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Details Section Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            
            {[...Array(4)].map((_, i) => (
              <div key={`personal-${i}`} className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>

          {/* Location Details Section Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            
            {[...Array(4)].map((_, i) => (
              <div key={`location-${i}`} className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences Section Skeleton */}
        <div className="mt-8 space-y-6">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          
          {[...Array(2)].map((_, i) => (
            <div key={`pref-${i}`} className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}

          {/* Interests Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={`interest-${i}`} className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Topics Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={`topic-${i}`} className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
