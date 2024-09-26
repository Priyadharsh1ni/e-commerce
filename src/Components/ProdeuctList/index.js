import React, { useEffect, useState } from 'react';
import { Button, Dialog, Typography, Checkbox, DialogTitle, DialogContent } from '@mui/material';
import { Line, SearchIcon } from '../../assets'
import style from '../Products/style.css'


const ProductDialog = ({ onProductSelect, onVarientProductSelect, onClose }) => {
    const [open, setOpen] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState(new Set()); // Track selected product IDs
    const [selectedVariants, setSelectedVariants] = useState(new Set()); // Track selected variants
    const [variantTitles, setVariantTitles] = useState([]); // Store selected variant titles

    const fetchProducts = async () => {
        try {
            const response = [
                {
                    "id": 77,
                    "title": "Fog Linen Chambray Towel - Beige Stripe",
                    "variants": [
                        { "id": 1, "product_id": 77, "title": "XS / Silver", "price": "49" },
                        { "id": 2, "product_id": 77, "title": "S / Silver", "price": "49" },
                        { "id": 3, "product_id": 77, "title": "M / Silver", "price": "49" }
                    ],
                    "image": { "id": 266, "product_id": 77, "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1" }
                },
                {
                    "id": 80,
                    "title": "Orbit Terrarium - Large",
                    "variants": [
                        { "id": 64, "product_id": 80, "title": "Default Title", "price": "109" }
                    ],
                    "image": { "id": 272, "product_id": 80, "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1" }
                }
            ];

            setProducts(response); // Set fetched products
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        setSelectedProductIds((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(productId)) {
                newSelected.delete(productId);
            } else {
                newSelected.add(productId);
            }
            return newSelected;
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariants((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(variant.id)) {
                newSelected.delete(variant.id);
            } else {
                newSelected.add(variant.id);
            }
            return newSelected;
        });

        // Update variant titles based on selection
        setVariantTitles((prevTitles) => {
            const newTitles = new Set(prevTitles);
            if (newTitles.has(variant.title)) {
                newTitles.delete(variant.title);
            } else {
                newTitles.add(variant.title);
            }
            return Array.from(newTitles);
        });
    };

    // Filter products based on search term
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = () => {
        // Find the selected products
        const selectedProducts = products.filter(product => selectedProductIds.has(product.id));
        console.log("🚀 ~ handleAddProduct ~ selectedProducts:", selectedProducts);
        onProductSelect(selectedProducts.map(product => product.title));

        // Send selected variant titles
        if (variantTitles.length > 0) {
            console.log("🚀 ~ handleAddProduct ~ variantTitles:", variantTitles);
            onVarientProductSelect(variantTitles);
        }
        onClose(true);
    };

    const handleClose = () => {
        onClose(true);
    };

    return (
        <div>
            <DialogTitle>
                <Typography>Select Products</Typography>
            </DialogTitle>
            <DialogContent>
                <div style={{
                    display: 'flex', padding: '10px',
                    alignItems: 'center',
                    border: '1px solid #0012', gap: '10px'
                }}>
                    <SearchIcon />
                    <input
                        placeholder="Search Product"
                        fullWidth
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className='input-box'
                    />
                </div>
                <Line />
                {filteredProducts.map((item) => (
                    <div key={item.id} className='Product-list-container'>
                        <div onClick={() => handleProductClick(item.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Checkbox checked={selectedProductIds.has(item.id)} onChange={() => handleProductClick(item.id)} />
                            <Typography>{item.title}</Typography>
                        </div>
                        {selectedProductIds.has(item.id) && <Line />}
                        {selectedProductIds.has(item.id) && item.variants && (
                            <div style={{
                                padding: '10px', marginLeft: '30px', display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {item.variants.map((variant) => (
                                    <div key={variant.id} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={selectedVariants.has(variant.id)} // Check if the variant is selected
                                            onChange={() => handleVariantSelect(variant)} // Toggle variant selection
                                        />
                                        <img src={item.image.src} alt={item.title} style={{ width: '50px', marginRight: '10px' }} />
                                        <Typography>{variant.title}</Typography>
                                        <Typography>${variant.price}</Typography>
                                    </div>
                                ))}
                                <Line />
                            </div>
                        )}
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{variantTitles.length} variants selected: {variantTitles.join(', ')}</Typography>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button sx={{ border: "1px solid #008060", padding: '5px 15px' }} onClick={handleClose}>Cancel</Button>
                        <Button sx={{ color: 'white', backgroundColor: '#008060', padding: '5px 15px' }} onClick={handleAddProduct}>Add</Button>
                    </div>
                </div>
            </DialogContent>
        </div>
    );
};

export default ProductDialog;
