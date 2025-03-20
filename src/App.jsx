import { Box, Button, TextField, Toolbar, AppBar, Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        const apiKey = 'AIzaSyCpsYM3E7OZh4HrzoMrEEhm-tFycMI9Lew'; // Reemplaza con tu clave API
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: inputText }],
            }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Error de la API: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = { text: data.candidates[0].content.parts[0].text, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error al obtener respuesta de Gemini:', error);
        const errorMessage = { text: `Error: ${error.message}`, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            RosaditaGPT
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          marginTop: '64px', // Altura de la AppBar
          padding: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
{messages.map((message, index) => (
  <Box
    key={index}
    sx={{
      textAlign: message.sender === 'user' ? 'right' : 'left',
      marginBottom: 2,
      padding: 2,
      backgroundColor: message.sender === 'user' ? '#eef' : '#e8f5e9',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    }}
  >
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <Typography variant="h4" gutterBottom {...props} />
        ),
        h2: ({ node, ...props }) => (
          <Typography variant="h5" gutterBottom {...props} />
        ),
        h3: ({ node, ...props }) => (
          <Typography variant="h6" gutterBottom {...props} />
        ),
        p: ({ node, ...props }) => (
          <Typography variant="body1" {...props} />
        ),
        li: ({ node, ...props }) => (
          <Typography component="li" variant="body2" {...props} />
        ),
        code: ({ node, ...props }) => (
          <Typography
            component="code"
            sx={{
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: '2px 4px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            {...props}
          />
        ),
      }}
    >
      {message.text}
    </ReactMarkdown>
  </Box>
))}


        {isLoading && <Typography>Cargando...</Typography>}
        <div ref={messagesEndRef}></div>
      </Box>

      {/* Barra fija para entrada */}
      <Box marginTop={10}>.</Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 2,
          borderTop: '1px solid #ccc',
          backgroundColor: '#fff',
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '93%', // Asegura que no sobresalga
        }}
      >
        <TextField
          label="Escribe tu mensaje..."
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!inputText.trim() || isLoading}
          onClick={sendMessage}
          endIcon={<SendIcon/>}
        >
          {isLoading ? 'Cargando...' : 'send'}
          <Box marginTop={2}>.</Box>
        </Button>
      </Box>
    </Box>
  );
}

export default App;
