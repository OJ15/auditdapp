// import useTokenInfo from '@/hooks/useTokenInfo';
import { getResponse } from '@/utils/openAIUtils';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FaFacebookMessenger, FaRobot, FaTimes, FaUserCircle } from 'react-icons/fa'; // Importing React Icons
// const { isFetching, tokenInfo, error } = useTokenInfo(contractAddress, 'meta', true);
import axios from 'axios';
// const openai = new OpenAI({ apiKey: '
const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    // const [chatHistory, setChatHistory] = useState([]);
    const [chatHistory, setChatHistory] = useState<{ user: string; message: string; loading?: boolean; response?: string; error?: boolean; }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // const chatContainerRef = useRef(null);
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const getPageContactAddress = () => {
        // Get the current page URL
        const currentUrl = window.location.href;

        // Extract the contact address from the last part of the URL
        const contactAddress = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
        return contactAddress;
    };

    interface TokenInfo {
        meta: any;
        security: any;
        scan: any;
    }

    const fetchTokenInfo = async (address: string): Promise<TokenInfo> => {
        try {
            // const metaPromise = "";
            const metaPromise = axios.get(`/api/token/info?address=${address}&type=meta`);
            const securityPromise = axios.get(`/api/token/info?address=${address}&type=security`);
            const livePromise = axios.get(`/api/token/live?address=${address}`);

            // Wait for all promises to resolve
            const [metaResponse, securityResponse, liveResponse] = await Promise.all([
                metaPromise,
                securityPromise,
                livePromise
            ]);

            // Extract data from responses
            const metaData = metaResponse.data;
            const securityData = securityResponse.data;
            const liveData = liveResponse.data;

            // Combine data into a single object
            const tokenInfo: TokenInfo = {
                meta: metaData,
                security: securityData,
                scan: liveData
            };
            return tokenInfo;
        } catch (error) {
            throw error; // Rethrow the error to be handled by the caller
        }
    };


    const handleClose = () => {
        setIsOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserQuery(event.target.value);
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    };

    const memoizedGetResponse = useMemo(() => getResponse, []);

    const requestAnswerFromServer = async () => {
        try {
            const tokenInfo = await fetchTokenInfo(getPageContactAddress());
            const tokenInfoString = JSON.stringify(tokenInfo);

            // Combine additional data with existing instructions
            const instructions = `You should be mostly focused on the context of token's data like Solana chain and blockchain since our application is a dashboard of token data. Here's some additional information on the token user is currently viewing on our dashboard:
            here's json data  feel free to answer about extra information from web on related topic, but reply should seem like an asistant reply based on user's token input and our data, no halucinations in repsonse, avoid unclear things in data :
            \n\n${tokenInfoString},`;

            // Get response using updated instructions
            const completion = await memoizedGetResponse(instructions, chatHistory, userQuery);
            return completion;
        } catch (error) {
            console.error('Error:', error);
            return "Something went wrong while asking the AI asistant, maybe try reloading the chat window or you can always try again later."
            throw error;
        }
    };



    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userQuery.trim()) return;

        try {
            setIsLoading(true);
            setChatHistory([...chatHistory, { user: 'You', message: userQuery, loading: true }]);

            const response = await requestAnswerFromServer();
            setChatHistory([...chatHistory, { user: 'You', message: userQuery, response: response ?? undefined }]);
            setUserQuery('');
        } catch (error: any) { 
            console.error("Failed to get response:", error.message);
            setChatHistory([...chatHistory, { user: 'You', message: userQuery, error: true }]);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div>
            {isOpen && (
                <div className="fixed bottom-8 right-8 z-50 w-1/2 h-[480px] overflow-hidden p-2">
                    <div className="bg-slate-500/10 bg-opacity-30 backdrop-blur-lg p-8 rounded-3xl shadow-zinc-500 shadow-lg h-full flex flex-col justify-between items-center relative">
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={handleClose}
                                className="text-white text-lg font-bold rounded-full bg-transparent hover:text-[#e247fb] focus:ring-pink p-2"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                        </div>
                        <h2 className="text-lg font-bold text-white mb-4">Smart Audit Assistant</h2>
                        <div ref={chatContainerRef} className="h-4/5 w-full overflow-y-scroll">
                            {chatHistory.map((chat, index) => (
                                <div key={index} className={`mb-2 ${chat.user === 'You' ? 'text-left' : 'text-right'}`}>
                                    {chat.loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="h-4 w-4 bg-gradient-to-br from-[#c0f437] to-[#e247fb] rounded-full mr-2 animate-spin"></div>
                                            <p className="p-2">Loading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {chat.user === 'You' ? (
                                                <>
                                                    <p className="p-2"><FaUserCircle className="inline-block mr-2" /> <strong>{chat.user}:</strong> {chat.message}</p>
                                                    {chat.response && <p className="p-2"><FaRobot className="inline-block mr-2" /> <strong>Smart Audit:</strong> {chat.response}</p>}
                                                </>
                                            ) : (
                                                <>
                                                    {chat.response && <p className="p-2"><FaRobot className="inline-block mr-2" /> <strong>Smart Audit:</strong> {chat.response}</p>}
                                                    <p className="p-2"><FaUserCircle className="inline-block mr-2" /> <strong>{chat.user}:</strong> {chat.message}</p>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} className="w-full flex justify-between items-center mt-4">
                            <input
                                type="text"
                                value={userQuery}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me anything about the token..."
                                className="w-3/4 p-4 border border-gray-300 rounded-full bg-transparent text-white focus:outline-none focus:ring-2 focus:bg-[#e247fb]/10"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="ml-2 text-white bg-gradient-to-l from-[#1694f1]/30 to-[#e247fb]/30 hover:from-[#0577ff] hover:to-[#c62ee5] font-bold py-4 px-8 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading || !userQuery.trim()}
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <button
                onClick={toggleChat}
                className={`bg-gradient-to-tr from-[#c0f437]/60 from-1% via-slate-800 via-40% to-[#c0f437]/90 hover:from-[#e247fb]/40 from-1% hover:via-slate-800 hover:via-40% hover:to-[#e247fb]/90 text-white font-bold py-8 px-8 rounded-full shadow-md shadow-slate-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isOpen ? 'hidden' : 'rounded-full'}`}
            >Ask AI
                <FaFacebookMessenger className="h-6 w-6" />
            </button>
        </div>
    );
};

export default ChatWindow;
