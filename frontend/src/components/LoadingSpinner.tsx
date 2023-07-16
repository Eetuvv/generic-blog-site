import React from "react"

const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <svg
        className="animate-spin h-8 w-8"
        viewBox="0 0 24 24"
        style={{ color: "var(--spinner-color)" }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 008-8h-4a4 4 0 11-4 4v4z"
        ></path>
      </svg>
    </div>
  )
}

export default LoadingSpinner
