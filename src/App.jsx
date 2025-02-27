// npm run dev
//https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

//Here is the supabase table:
//cards:
/*
[
  {
    "column_name": "card_id",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "column_name": "card_title",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "main_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "model_number",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "card_body",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "mfg",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "card_type",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "main_card_image",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "mfg_price",
    "data_type": "real",
    "is_nullable": "YES"
  }
]
*/

import { useState, useEffect } from 'react'
import './App.css'

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getCards() {
    try {
      console.log('Attempting to fetch cards...');
      
      // First, let's check if we can list all tables
      const { data: tables, error: tablesError } = await supabase
        .from('_tables')
        .select('*');
      console.log('Available tables:', tables);

      // Then try to get the cards
      const { data, error } = await supabase
        .from("cards")
        .select('*');
        
      if (error) {
        console.error('Supabase Error:', error);
        throw error;
      }
      
      console.log('Data received:', {
        hasData: Boolean(data),
        length: data?.length || 0,
        firstItem: data?.[0],
        rawData: data
      });
      
      setCards(data || []);
    } catch (error) {
      console.error('Connection Error:', {
        message: error.message,
        details: error,
        status: error.status,
        statusText: error.statusText
      });
    } finally {
      setLoading(false);
    }
  }

  // Test connection when component mounts
  useEffect(() => {
    getCards();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cards.length === 0 ? (
        <div>
          <p>Check Policy</p>
        </div>
      ) : (
        <ul>
          {cards.map((card) => (
            <li key={card.card_id}>{card.card_title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
