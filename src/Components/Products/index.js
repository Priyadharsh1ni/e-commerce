import React, { useState } from 'react';
import { EditIcon, Line, Logo } from '../../assets';
import { Button, Dialog } from '@mui/material';
import ProductList from '../ProdeuctList/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import style from './style.css';

function Index() {
    const [openProduct, setOpenProduct] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [varientSelectedProducts, setVarientSelectedProducts] = useState([]);
    const [discountInputs, setDiscountInputs] = useState({}); 

    const handleAddProduct = () => {
        setOpenProduct(!openProduct);
    };

    const handleProductSelect = (productName) => {
        setSelectedProducts((prev) => [...prev, productName]);
    };

    const handleVarientProductSelect = (variantName) => {
        setVarientSelectedProducts((prev) => [...prev, variantName]);
    };

    const handleClose = () => {
        setOpenProduct(false);
    };

    const handleDragEnd = (result) => {
        const { source, destination, type } = result;

        if (!destination) return;

        if (type === 'products') {
            const items = Array.from(selectedProducts);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setSelectedProducts(items);
        }

        if (type === 'variants') {
            const varientItems = Array.from(varientSelectedProducts);
            const [reorderedItem] = varientItems.splice(source.index, 1);
            varientItems.splice(destination.index, 0, reorderedItem);
            setVarientSelectedProducts(varientItems);
        }
    };

    const handleDiscountToggle = (productIndex) => {
        setDiscountInputs((prevState) => ({
            ...prevState,
            [productIndex]: !prevState[productIndex], 
        }));
    };

    return (
        <div>
            <div className='Header'>
                <Logo />
                Monk Upsell & Cross-sell
            </div>
            <Line />
            <div className='Products-container'>
                <div style={{ width: '800px', display: "flex", flexDirection: "column", gap: "30px" }}>
                    <h5>Add Products</h5>
                    <div className='product-input-container'>
                        <div className='product'>
                            <p>Product</p>
                            {selectedProducts.length === 0 && (
                                <div className='input' onClick={handleAddProduct}>
                                    <input className='input-box' placeholder='Select Product' value="" readOnly />
                                    <EditIcon />
                                </div>
                            )}

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <div>
                                    <Droppable droppableId="droppableProducts" type="products">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                {selectedProducts.map((product, index) => (
                                                    <Draggable key={product + index} draggableId={`product-${index}`} index={index}>
                                                        {(provided) => (
                                                            <div style={{    display: 'flex',
                                                                /* flex-direction: row; */
                                                                gap: '30px'}}>
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className='input'
                                                                style={{ display: 'flex', justifyContent: "space-between", flexDirection: 'row' }}
                                                            >
                                                                <input
                                                                    className='input-box'
                                                                    placeholder='Selected Product'
                                                                    value={product}
                                                                    readOnly
                                                                    onClick={handleAddProduct}
                                                                />
                                                                <EditIcon />
                                                                </div>
                                                                {/* Discount Button and Input */}
                                                                {!discountInputs[index] && (
                                                                    <Button 
                                                                        sx={{ color: 'white', backgroundColor: '#008060', padding: '5px 15px', marginLeft: '10px' }}
                                                                        onClick={() => handleDiscountToggle(index)}
                                                                    >
                                                                        Add Discount
                                                                    </Button>
                                                                )}

                                                                {discountInputs[index] && (
                                                                    <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                                                                        
                                                                       <div className='input'> <input className='input-box' placeholder='Discount' /></div>
                                                                       <div className='input'>  <input className='input-box' placeholder='Additional Discount' /></div>
                                                                    </div>
                                                            
                                                                )}
                                                       
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </DragDropContext>
                        </div>
                    </div>
                    <div>
                        <Button sx={{ border: "1px solid #008060", padding: '5px 15px' }} onClick={handleAddProduct}>Add Product</Button>
                    </div>
                </div>
            </div>
            {openProduct && (
                <Dialog open={openProduct} fullWidth maxWidth="sm">
                    <ProductList onProductSelect={handleProductSelect} onVarientProductSelect={handleVarientProductSelect} onClose={handleClose} />
                </Dialog>
            )}
        </div>
    );
}

export default Index;
