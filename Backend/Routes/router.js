const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const products = require('../Models/Products');
const User = require('../Models/User');
const axios = require('axios');
const Sales = require('../Models/Sales');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const path = require('path');

let cachedTopProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

function runPythonForecast(salesData, periods = 30) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['demand_forecast.py']);

        let result = '';
        let error = '';
        let timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Python forecast process timed out'));
        }, 15000); // 15 seconds timeout

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${error}`));
            } else {
                try {
                    // Assuming the Python script prints JSON string of forecast data
                    const forecast = JSON.parse(result);
                    resolve(forecast);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });

        // Send sales data as JSON string to Python stdin
        pythonProcess.stdin.write(JSON.stringify({ salesData, periods }));
        pythonProcess.stdin.end();
    });
}

function runPythonAggregator() {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['top_products_aggregator.py']);

        let result = '';
        let error = '';
        let timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Python aggregator process timed out'));
        }, 1200000); // 120 seconds timeout

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(`Python aggregator process exited with code ${code}: ${error}`));
            } else {
                try {
                    const topProducts = JSON.parse(result);
                    resolve(topProducts);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

async function refreshTopProductsCache() {
    try {
        const topProducts = await runPythonAggregator();
        cachedTopProducts = topProducts;
        cacheTimestamp = Date.now();
        console.log('Top products cache refreshed');
    } catch (error) {
        console.error('Failed to refresh top products cache:', error.message);
    }
}

// Remove synchronous initial cache refresh to avoid blocking server start
// refreshTopProductsCache();

// Periodic cache refresh every hour
setInterval(refreshTopProductsCache, CACHE_DURATION_MS);

router.get('/api/top50forecast', async (req, res) => {
    try {
        console.log('Top50forecast request received');
        console.log('Cache timestamp:', cacheTimestamp);
        console.log('Cache age (ms):', cacheTimestamp ? Date.now() - cacheTimestamp : 'N/A');
        console.log('Cached top products:', cachedTopProducts ? `Array length: ${cachedTopProducts.length}` : 'No cache');

        // Serve cached top products if available and fresh
        if (cachedTopProducts && (Date.now() - cacheTimestamp) < CACHE_DURATION_MS) {
            console.log('Serving cached top products');
            return res.json(cachedTopProducts);
        }

        // If cache is empty or stale, trigger async cache refresh but serve fallback response immediately
        refreshTopProductsCache();

        if (cachedTopProducts) {
            console.log('Serving cached top products after async refresh trigger');
            return res.json(cachedTopProducts);
        } else {
            // Serve fallback response if cache is empty
            console.log('Cache empty, sending 202 response');
            return res.status(202).json({ message: 'Top products data is being prepared, please try again shortly.' });
        }
    } catch (error) {
        console.error('Error fetching top 50 forecast:', error.message);
        res.status(500).json({ message: 'Failed to fetch top 50 forecast data' });
    }
});

function runPythonAggregator() {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['top_products_aggregator.py']);

        let result = '';
        let error = '';
        let timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Python aggregator process timed out'));
        }, 15000); // 15 seconds timeout

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(`Python aggregator process exited with code ${code}: ${error}`));
            } else {
                try {
                    const topProducts = JSON.parse(result);
                    resolve(topProducts);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

router.post("/insertproduct", async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode, ProductStock, ProductMainCategory, ProductSubCategory } = req.body;

    try {
        const pre = await products.findOne({ ProductBarcode: ProductBarcode })
        console.log(pre);

        if (pre) {
            res.status(422).json("Product is already added.")
        }
        else {
            const addProduct = new products({ ProductName, ProductPrice, ProductBarcode, ProductStock, ProductMainCategory, ProductSubCategory })

            await addProduct.save();
            res.status(201).json(addProduct)
            console.log(addProduct)
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/products', async (req, res) => {

    try {
        const getProducts = await products.find({})
        console.log(getProducts);
        res.status(201).json(getProducts);
    }
    catch (err) {
        console.log(err);
    }
})

router.get('/products/:id', async (req, res) => {

    try {
        const getProduct = await products.findById(req.params.id);
        console.log(getProduct);
        res.status(201).json(getProduct);
    }
    catch (err) {
        console.log(err);
    }
})

router.put('/updateproduct/:id', async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode, ProductStock, ProductMainCategory, ProductSubCategory } = req.body;

    try {
        const updateProducts = await products.findByIdAndUpdate(req.params.id, { ProductName, ProductPrice, ProductBarcode, ProductStock, ProductMainCategory, ProductSubCategory }, { new: true });
        console.log("Data Updated");
        res.status(201).json(updateProducts);
    }
    catch (err) {
        console.log(err);
    }
})

router.delete('/deleteproduct/:id', async (req, res) => {

    try {
        const deleteProduct = await products.findByIdAndDelete(req.params.id);
        console.log("Data Deleted");
        res.status(201).json(deleteProduct);
    }
    catch (err) {
        console.log(err);
    }
})

router.get('/current_user', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email and password' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Logout error:', err);
                res.status(500).json({ message: 'Logout failed' });
            } else {
                res.clearCookie('connect.sid');
                res.json({ message: 'Logout successful' });
            }
        });
    } else {
        res.status(400).json({ message: 'No active session' });
    }
});

router.get('/api/forecast', async (req, res) => {
    try {
        // Get distinct product IDs
        const productIds = await Sales.distinct('productId');

        const forecastResults = [];

        for (const productId of productIds) {
            // Get sales data for product
            const sales = await Sales.find({ productId }).sort({ date: 1 });

            // Prepare data for Python script: [{ds: date, y: quantity}, ...]
            const salesData = sales.map(s => ({
                ds: s.date.toISOString().split('T')[0],
                y: s.quantity
            }));

            // Run Python forecast
            const forecast = await runPythonForecast(salesData);

            // Get product name
            const product = await mongoose.model('Products').findById(productId);

            forecastResults.push({
                productId,
                productName: product ? product.ProductName : 'Unknown',
                forecast
            });
        }

        res.json(forecastResults);
    } catch (error) {
        console.error('Error fetching forecast:', error.message);
        res.status(500).json({ message: 'Failed to fetch forecast data' });
    }
});

router.get('/api/top50forecast', async (req, res) => {
    try {
        // Load top 50 products from dataset aggregator via Python script
        const topProducts = await runPythonAggregator();

        const forecastResults = [];

        for (const product of topProducts) {
            // Simulate sales data as a constant series with total no_of_ratings as sales
            const salesData = [];
            const today = new Date();
            for (let i = 30; i > 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                salesData.push({
                    ds: date.toISOString().split('T')[0],
                    y: product.no_of_ratings / 30  // average daily sales
                });
            }

            // Run Python forecast
            const forecast = await runPythonForecast(salesData);

            forecastResults.push({
                productId: null,
                productName: product.name,
                mainCategory: product.main_category,
                subCategory: product.sub_category,
                forecast
            });
        }

        res.json(forecastResults);
    } catch (error) {
        console.error('Error fetching top 50 forecast:', error.message);
        res.status(500).json({ message: 'Failed to fetch top 50 forecast data' });
    }
});

module.exports = router;
