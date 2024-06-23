export const tripMonitoringHandlers = {
  tripMonitoring: (data: any, setMessages: any) => {
    console.log('Trip monitoring:', data);
    setMessages((prevMessages: any) => [...prevMessages, data]);
  },
  // Add more events as needed
};

export const faceMonitoringHandlers = {
  faceMonitoringData: (data: any, setMessages: any) => {
    console.log('Face monitoring:', data);
    setMessages((prevMessages: any) => [...prevMessages, data]);
  },
  // Add more events as needed
};
