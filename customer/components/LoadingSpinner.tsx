import React from 'react'

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center">
            <button className="btn btn-square">
                <span className="loading loading-spinner"></span>
            </button>
        </div>
    )
}

export default LoadingSpinner