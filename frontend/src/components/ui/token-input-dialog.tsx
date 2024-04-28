// TokenInputDialog.tsx

import React, { useState } from 'react';

interface TokenInputDialogProps {
    onSubmit: (tokenAddress: string) => Promise<void>;
}

const TokenInputDialog: React.FC<TokenInputDialogProps> = ({ onSubmit }) => {

    const [tokenAddress, setTokenAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        await onSubmit(tokenAddress);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading delay
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-700 bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-zinc-500 shadow-lg w-120 h-96 flex flex-col justify-between items-center">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">Token Audit</h2>
            <p className="text-white text-lg mb-6 text-center">
                Submit the token contract address to get detailed analysis and make informed decisions.
            </p>
            <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter Contract Address"
                className="w-full p-4 border border-gray-300 rounded-full mb-4 bg-transparent text-white text-center"
                onKeyPress={handleKeyPress}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !tokenAddress.trim()}
                className={`w-full bg-gradient-to-r from-[#1694f1] to-[#e247fb] hover:from-[#0577ff] hover:to-[#c62ee5] text-[#] font-bold py-4 px-6 rounded-full shadow-md transition duration-300 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    );
};

export default TokenInputDialog;
