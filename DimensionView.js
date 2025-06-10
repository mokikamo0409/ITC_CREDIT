document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const welcomeModal = document.getElementById('welcome-modal');
    const startDemoBtn = document.getElementById('start-demo-btn');
    const calibrationModal = document.getElementById('calibration-modal');
    const calibrationChoiceView = document.getElementById('calibration-choice-view');
    const calibrationManualView = document.getElementById('calibration-manual-view');
    const autoCalibrateBtn = document.getElementById('auto-calibrate-btn');
    const manualCalibrateBtn = document.getElementById('manual-calibrate-btn');
    const calibrationSlider = document.getElementById('calibration-slider');
    const creditCardAnim = document.getElementById('credit-card-anim');
    const finishCalibrationBtn = document.getElementById('finish-calibration-btn');
    const resetDemoBtn = document.getElementById('reset-demo-btn');
    const storeSelector = document.getElementById('store-selector');
    const storeLogo = document.getElementById('store-logo');
    const storeName = document.getElementById('store-name');
    const searchBar = document.getElementById('search-bar');
    const productListEl = document.getElementById('product-list');
    const canvasContainer = document.getElementById('canvas-container');
    const canvas = document.getElementById('canvas');
    const scaleSlider = document.getElementById('scale-slider');
    const scaleValueEl = document.getElementById('scale-value');
    const notificationContainer = document.getElementById('notification-container');
    const measureBtn = document.getElementById('measure-btn');
    const measurementCanvas = document.getElementById('measurement-canvas');
    const mCtx = measurementCanvas.getContext('2d');
    const itemInfoPanel = document.getElementById('item-info-panel');
    const itemInfoText = document.getElementById('item-info-text');
    
    // Mobile Sidebar Elements
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // --- State Variables ---
    let pixelsPerCm = 38; 
    let isCalibrated = false;
    let isMeasuring = false;
    let measureStart = {};
    let activeStore = 'taobao';

    // --- Data ---
    const stores = {
        taobao: {
            name: "Taobao",
            logo: "https://placehold.co/40x40/ff6a00/ffffff?text=TB",
            products: [
                { id: 'taobao-shirt-1', name: 'Graphic Print T-Shirt', price: '12', width: 56, height: 73, img: 'https://placehold.co/200x200/f0f0f0/333?text=Shirt', canvasImg: 'https://placehold.co/560x730/f0f0f0/333?text=Shirt' },
                { id: 'taobao-pants-1', name: 'Wide-Leg Cargo Pants', price: '22', width: 48, height: 105, img: 'https://placehold.co/200x200/f0f0f0/333?text=Pants', canvasImg: 'https://placehold.co/480x1050/f0f0f0/333?text=Pants' },
                { id: 'taobao-dress-1', name: 'Summer Floral Dress', price: '28', width: 46, height: 110, img: 'https://placehold.co/200x200/f0f0f0/333?text=Dress', canvasImg: 'https://placehold.co/460x1100/f0f0f0/333?text=Dress' },
                { id: 'taobao-blouse-1', name: 'Chiffon Ruffle Blouse', price: '19', width: 50, height: 65, img: 'https://placehold.co/200x200/f0f0f0/333?text=Blouse', canvasImg: 'https://placehold.co/500x650/f0f0f0/333?text=Blouse' },
            ]
        },
        jd: {
            name: "JD.com",
            logo: "https://placehold.co/40x40/ef4444/ffffff?text=JD",
            products: [
                { id: 'jd-polo-1', name: 'Performance Polo', price: '22', width: 52, height: 70, img: 'https://placehold.co/200x200/f0f0f0/333?text=Polo', canvasImg: 'https://placehold.co/520x700/f0f0f0/333?text=Polo' },
                { id: 'jd-hoodie-1', name: 'Tech Fleece Hoodie', price: '45', width: 62, height: 75, img: 'https://placehold.co/200x200/f0f0f0/333?text=Hoodie', canvasImg: 'https://placehold.co/620x750/f0f0f0/333?text=Hoodie' },
                { id: 'jd-shirt-1', name: 'Business Casual Shirt', price: '29', width: 54, height: 76, img: 'https://placehold.co/200x200/f0f0f0/333?text=Shirt', canvasImg: 'https://placehold.co/540x760/f0f0f0/333?text=Shirt' },
                { id: 'jd-trench-coat-1', name: 'Classic Trench Coat', price: '75', width: 58, height: 115, img: 'https://placehold.co/200x200/f0f0f0/333?text=Coat', canvasImg: 'https://placehold.co/580x1150/f0f0f0/333?text=Coat' },
            ]
        },
        tmall: {
            name: "Tmall",
            logo: "https://placehold.co/40x40/f87171/ffffff?text=TM",
            products: [
                { id: 'tmall-down-vest', name: 'Light Down Vest', price: '49', width: 56, height: 66, img: 'https://placehold.co/200x200/f0f0f0/333?text=Vest', canvasImg: 'https://placehold.co/560x660/f0f0f0/333?text=Vest' },
                { id: 'tmall-shorts-1', name: 'Cargo Shorts', price: '25', width: 50, height: 55, img: 'https://placehold.co/200x200/f0f0f0/333?text=Shorts', canvasImg: 'https://placehold.co/500x550/f0f0f0/333?text=Shorts' },
                { id: 'tmall-sweater-1', name: 'Knit Crewneck Sweater', price: '35', width: 59, height: 71, img: 'https://placehold.co/200x200/f0f0f0/333?text=Sweater', canvasImg: 'https://placehold.co/590x710/f0f0f0/333?text=Sweater' },
                { id: 'tmall-skirt-1', name: 'Pleated A-Line Skirt', price: '25', width: 38, height: 75, img: 'https://placehold.co/200x200/f0f0f0/333?text=Skirt', canvasImg: 'https://placehold.co/380x750/f0f0f0/333?text=Skirt' },
            ]
        }
    };

    // --- Functions ---
    const init = () => {
        renderStoreSelector();
        setActiveStore(activeStore);
        updateScaleDisplay();
        setupMeasurementCanvas();
        setupEventListeners();
    };

    const resetDemo = () => {
        canvas.innerHTML = '';
        calibrationChoiceView.style.display = 'block';
        calibrationManualView.style.display = 'none';
        welcomeModal.style.display = 'flex';
        calibrationModal.style.display = 'none';
        itemInfoPanel.style.display = 'none';
        isCalibrated = false;
        setActiveStore('taobao');
        if (isMeasuring) toggleMeasurement();
        if (!sidebar.classList.contains('-translate-x-full')) {
            toggleSidebar();
        }
    };

    const toggleSidebar = () => {
        sidebar.classList.toggle('-translate-x-full');
        sidebarOverlay.classList.toggle('hidden');
    };

    const showNotification = (message, isError = false) => {
        const notif = document.createElement('div');
        notif.className = `notification pointer-events-auto p-4 rounded-lg shadow-lg text-white font-semibold ${isError ? 'bg-red-500' : 'bg-blue-500'}`;
        notif.textContent = message;
        notificationContainer.appendChild(notif);
        setTimeout(() => { notif.style.opacity = '1'; notif.style.transform = 'translateX(0)'; }, 10);
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(20px)';
            setTimeout(() => notif.remove(), 500);
        }, 4000);
    };
    
    function renderStoreSelector() {
        storeSelector.innerHTML = Object.keys(stores).map(key => {
            const store = stores[key];
            const isActive = key === activeStore;
            return `<button data-store="${key}" class="store-btn text-sm font-bold py-2 rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">${store.name.split(' ')[0]}</button>`;
        }).join('');
    }

    function setActiveStore(storeKey) {
        activeStore = storeKey;
        searchBar.value = '';
        const store = stores[activeStore];
        storeName.textContent = store.name;
        storeLogo.src = store.logo;
        storeLogo.onerror = () => { storeLogo.src = 'https://placehold.co/40x40/cccccc/ffffff?text=??' };
        renderStoreSelector();
        renderProductList();
    }

    const renderProductList = (searchTerm = '') => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const products = stores[activeStore].products.filter(p => 
            p.name.toLowerCase().includes(lowerCaseSearchTerm)
        );

        if (products.length === 0) {
            productListEl.innerHTML = `<p class="text-center text-gray-500 py-4">No products found for "${searchTerm}".</p>`;
            return;
        }

        productListEl.innerHTML = products
            .map(product => `
            <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex gap-4">
                    <div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 bg-contain bg-center bg-no-repeat" style="background-image: url('${product.img}');"></div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-lg font-bold text-blue-600">$${product.price}</p>
                        <p class="text-xs text-gray-500 mt-1">Size M: ${product.width}cm x ${product.height}cm</p>
                    </div>
                </div>
                <button data-product-id="${product.id}" class="view-btn mt-3 w-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-2 px-4 rounded-lg transition-colors text-sm">View in DimensionView</button>
            </div>
        `).join('');
    };
    
    const setupEventListeners = () => {
        startDemoBtn.addEventListener('click', () => {
            welcomeModal.style.display = 'none';
            calibrationModal.style.display = 'flex';
        });

        autoCalibrateBtn.addEventListener('click', () => {
            pixelsPerCm = 38;
            isCalibrated = true;
            calibrationModal.style.display = 'none';
            showNotification("Auto-calibration complete!");
        });

        manualCalibrateBtn.addEventListener('click', () => {
            calibrationChoiceView.style.display = 'none';
            calibrationManualView.style.display = 'block';
        });

        calibrationSlider.addEventListener('input', (e) => {
            creditCardAnim.style.transform = `scale(${e.target.value})`;
        });

        finishCalibrationBtn.addEventListener('click', () => {
            const cardWidthInPixels = creditCardAnim.getBoundingClientRect().width;
            pixelsPerCm = cardWidthInPixels / 8.56;
            isCalibrated = true;
            calibrationModal.style.display = 'none';
            showNotification("Manual calibration complete!");
        });

        resetDemoBtn.addEventListener('click', resetDemo);
        scaleSlider.addEventListener('input', updateScaleDisplay);
        measureBtn.addEventListener('click', toggleMeasurement);

        storeSelector.addEventListener('click', e => {
            if (e.target.matches('.store-btn')) {
                setActiveStore(e.target.dataset.store);
            }
        });
        
        searchBar.addEventListener('input', e => {
            renderProductList(e.target.value);
        });

        productListEl.addEventListener('click', e => {
            if (e.target.classList.contains('view-btn')) {
                const products = stores[activeStore].products;
                createCanvasItem(products.find(p => p.id === e.target.dataset.productId));
                // On mobile, close sidebar after selection
                if (window.innerWidth < 768) { // Tailwind's `md` breakpoint
                    toggleSidebar();
                }
            }
        });

        canvas.addEventListener('click', e => {
            if(e.target.classList.contains('canvas-item')) {
                selectItem(e.target);
            } else {
                unselectAllItems();
            }
        });

        // Sidebar toggle listeners
        menuToggleBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);

        // Measurement listeners
        measurementCanvas.addEventListener('mousedown', measureStartHandler);
        measurementCanvas.addEventListener('touchstart', measureStartHandler);
        measurementCanvas.addEventListener('mousemove', measureMoveHandler);
        measurementCanvas.addEventListener('touchmove', measureMoveHandler);
        measurementCanvas.addEventListener('mouseup', measureEndHandler);
        measurementCanvas.addEventListener('touchend', measureEndHandler);
        measurementCanvas.addEventListener('mouseleave', measureEndHandler);
    };

    function updateAllItemScales() {
        const scaleFactor = parseFloat(scaleSlider.value);
        document.querySelectorAll('.canvas-item').forEach(item => {
            const baseWidth = parseFloat(item.dataset.baseWidth) || 0;
            const baseHeight = parseFloat(item.dataset.baseHeight) || 0;
            item.style.width = `${baseWidth * pixelsPerCm * scaleFactor}px`;
            item.style.height = `${baseHeight * pixelsPerCm * scaleFactor}px`;
        });
    }

    function updateScaleDisplay() {
        scaleValueEl.textContent = `${parseFloat(scaleSlider.value).toFixed(1)}x`;
        updateAllItemScales();
    }

    function createCanvasItem(product) {
        if (!product || !isCalibrated) {
            showNotification("Please complete calibration first!", true);
            return;
        }
        
        const existingItem = document.getElementById(product.id);
        if (existingItem) existingItem.remove();

        const item = document.createElement('div');
        item.id = product.id;
        item.className = 'canvas-item';
        item.dataset.baseWidth = product.width;
        item.dataset.baseHeight = product.height;
        item.style.backgroundImage = `url("${product.canvasImg || product.img}")`;
        
        canvas.appendChild(item);
        updateAllItemScales();
        
        const itemRect = item.getBoundingClientRect();
        const canvasRect = canvasContainer.getBoundingClientRect();
        item.style.left = `${Math.max(0, (canvasRect.width - itemRect.width) / 2)}px`;
        item.style.top = `${Math.max(0, (canvasRect.height - itemRect.height) / 2)}px`;

        makeItemDraggable(item);
        selectItem(item);
    }
    
    function selectItem(itemEl) {
        unselectAllItems();
        itemEl.classList.add('selected');
        const width = parseFloat(itemEl.dataset.baseWidth).toFixed(1);
        const height = parseFloat(itemEl.dataset.baseHeight).toFixed(1);
        itemInfoText.innerHTML = `Width: <strong>${width} cm</strong> <br> Height: <strong>${height} cm</strong>`;
        itemInfoPanel.style.display = 'block';
    }

    function unselectAllItems() {
        document.querySelectorAll('.canvas-item.selected').forEach(el => el.classList.remove('selected'));
        itemInfoPanel.style.display = 'none';
    }

    function makeItemDraggable(element) {
        let initialX, initialY, currentX = 0, currentY = 0;
        let startTop, startLeft;

        element.addEventListener('mousedown', dragStart);
        element.addEventListener('touchstart', dragStart, { passive: false });
        
        function dragStart(e) {
            if (isMeasuring) return;
            // e.preventDefault(); // This can interfere with touch scrolling, let elementDrag handle it

            startTop = element.offsetTop;
            startLeft = element.offsetLeft;
            
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            } else {
                initialX = e.clientX;
                initialY = e.clientY;
            }
            
            element.classList.add('ui-dragging');
            selectItem(element);
            
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('touchmove', elementDrag, { passive: false });
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('touchend', closeDragElement);
        }

        function elementDrag(e) {
            e.preventDefault();

            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            currentX = clientX - initialX;
            currentY = clientY - initialY;
            
            element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('touchmove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('touchend', closeDragElement);

            const canvasRect = canvasContainer.getBoundingClientRect();
            let finalLeft = startLeft + currentX;
            let finalTop = startTop + currentY;

            finalLeft = Math.max(0, Math.min(finalLeft, canvasRect.width - element.offsetWidth));
            finalTop = Math.max(0, Math.min(finalTop, canvasRect.height - element.offsetHeight));
            
            element.classList.remove('ui-dragging');
            element.style.transform = '';
            element.style.top = `${finalTop}px`;
            element.style.left = `${finalLeft}px`;

            currentX = 0;
            currentY = 0;
        }
    }

    function setupMeasurementCanvas() {
        const resizeCanvas = () => {
            const container = document.getElementById('canvas-container');
            measurementCanvas.width = container.clientWidth;
            measurementCanvas.height = container.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    function toggleMeasurement() {
        isMeasuring = !isMeasuring;
        measureBtn.classList.toggle('bg-blue-500', isMeasuring);
        measureBtn.classList.toggle('text-white', isMeasuring);
        measureBtn.classList.toggle('bg-gray-200', !isMeasuring);
        measurementCanvas.style.pointerEvents = isMeasuring ? 'auto' : 'none';
        if (!isMeasuring) {
            mCtx.clearRect(0, 0, measurementCanvas.width, measurementCanvas.height);
        }
    }

    function getEventCoords(e) {
        const rect = measurementCanvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : null;
        return {
            x: touch ? touch.clientX - rect.left : e.offsetX,
            y: touch ? touch.clientY - rect.top : e.offsetY
        };
    }

    function measureStartHandler(e) {
        if (!isMeasuring) return;
        e.preventDefault();
        measureStart = getEventCoords(e);
    }

    function measureMoveHandler(e) {
        if (!isMeasuring || !measureStart.x) return;
        e.preventDefault();
        const measureEnd = getEventCoords(e);
        mCtx.clearRect(0, 0, measurementCanvas.width, measurementCanvas.height);
        
        mCtx.beginPath();
        mCtx.moveTo(measureStart.x, measureStart.y);
        mCtx.lineTo(measureEnd.x, measureEnd.y);
        mCtx.strokeStyle = '#ef4444';
        mCtx.lineWidth = 2;
        mCtx.setLineDash([5, 5]);
        mCtx.stroke();
        mCtx.setLineDash([]);
        
        const dx = measureEnd.x - measureStart.x;
        const dy = measureEnd.y - measureStart.y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        const scaleFactor = parseFloat(scaleSlider.value);
        const distanceCm = (distancePixels / (pixelsPerCm * scaleFactor)).toFixed(1);
        
        const text = `${distanceCm} cm`;
        const midX = (measureStart.x + measureEnd.x) / 2;
        const midY = (measureStart.y + measureEnd.y) / 2;
        
        mCtx.font = 'bold 14px Inter';
        mCtx.textAlign = 'center';
        const textWidth = mCtx.measureText(text).width;
        
        mCtx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        mCtx.fillRect(midX - (textWidth / 2) - 8, midY - 18, textWidth + 16, 24);
        
        mCtx.fillStyle = '#ffffff';
        mCtx.fillText(text, midX, midY + 5);
    }

    function measureEndHandler(e) {
        if (!isMeasuring) return;
        e.preventDefault();
        measureStart = {};
    }

    // --- Initialisation ---
    init();
});