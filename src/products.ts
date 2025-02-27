//This is the product page that will display the product details
//Connect to supabase
//Display the product details
//Start with product id of Weihedesigns_WD-PDDL-3

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('cards')
                    .select('*')
                    .eq('card_id', id)
                    .single();

                if (error) throw error;

                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    
    return (
        <div>
            <h1>Product Details</h1>
            {loading ? (
                <p>Loading...</p>
            ) : product ? (
                <div>
                    <h2>{product.card_title}</h2>
                    <p>{product.card_body}</p>
                    <img 
                        src={product.main_card_image} 
                        alt={product.card_title}
                    />
                    <p>Model: {product.model_number}</p>
                    <p>Manufacturer: {product.mfg}</p>
                    {product.mfg_price && (
                        <p>Price: ${product.mfg_price}</p>
                    )}
                    {product.main_url && (
                        <a href={product.main_url} target="_blank" rel="noopener noreferrer">
                            Product Link
                        </a>
                    )}
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
}

export default ProductPage;