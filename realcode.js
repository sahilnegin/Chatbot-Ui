import React, { useState } from 'react';
import './DocumentUploaderAndChat.css';

function DocumentUploaderAndChat() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatResponse, setChatResponse] = useState('');
  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setSelectedDocument(file);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleUpload = () => {
    if (selectedDocument) {
      const formData = new FormData();
      formData.append('file', selectedDocument);

      fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error('Error uploading document:', error);
          alert('An error occurred while uploading the document.');
        });
    } else {
      alert('Please select a document before uploading.');
    }
  };

  const handleAsk = () => {
    if (prompt) {
      const newPrompt = { text: prompt, isUser: true };
      setChatHistory([...chatHistory, newPrompt]);

      fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: prompt }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          const response = data.answer;
          const newResponse = { text: response, isUser: false };
          setChatResponse(response);
          setChatHistory([...chatHistory, newResponse]);
          setPrompt(''); // Clear the input field
        })
        .catch((error) => {
          console.error('Error asking question:', error);
          alert('An error occurred while asking the question.');
        });
    } else {
      alert('Please enter a question before asking.');
    }
  };

  const handleStartChat = () => {
    if (prompt) {
      setChatHistory([...chatHistory, { text: prompt, isUser: true }]);
      setPrompt('');
    }
    setIsChatActive(!isChatActive);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div>
      {/* Render chat history and response here */}
  

      <div>
        <h1>Upload Your Documents Here</h1>
        <label htmlFor="fileInput" className="file-label">
          Choose File
        </label>
        <input
          type="file"
          id="fileInput"
          accept=".pdf, .doc, .docx"
          onChange={handleDocumentChange}
          style={{ display: 'none' }}
          multiple
        />
        <button className="buttondocument" onClick={handleUpload}>
          Upload Document
        </button>
      </div>
      <div className="chat-history">

        {chatResponse && (
          <div className="bot-message"> <h4>{chatResponse}</h4> </div>
        )}
      </div>
      <div className="chat-bar">
        <input
          type="text"
          placeholder="Enter a prompt"
          value={prompt}
          onChange={handlePromptChange}
          onKeyPress={handleKeyPress}
          style={{
            fontSize: '20px',
            backgroundColor: '#26282d',
            color: 'white',
          }}
        />
        <button onClick={handleAsk}>Ask Question</button>
      </div>

      <div className="para">
        <h3>You Can Chat With Your Documents Here</h3>
      </div>
    </div>
  );
}

export default DocumentUploaderAndChat;
