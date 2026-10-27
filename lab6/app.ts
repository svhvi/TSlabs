interface IProduct {
    id: number;
    title: string;
    price: number;
    category: string;
}

class ProductsManager {
    private products: IProduct[] = [];
    private nextId: number = 1;
    private editingId: number | null = null;

    // Посилання на DOM-елементи
    private form: HTMLFormElement;
    private titleInput: HTMLInputElement;
    private priceInput: HTMLInputElement;
    private categoryInput: HTMLInputElement;
    private idInput: HTMLInputElement;
    private submitBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private formTitle: HTMLElement;
    private container: HTMLElement;

    constructor() {
        // Ініціалізація посилань на DOM-елементи
        this.form = document.getElementById('product-form') as HTMLFormElement;
        this.titleInput = document.getElementById('title') as HTMLInputElement;
        this.priceInput = document.getElementById('price') as HTMLInputElement;
        this.categoryInput = document.getElementById('category') as HTMLInputElement;
        this.idInput = document.getElementById('product-id') as HTMLInputElement;
        this.submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
        this.cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
        this.formTitle = document.getElementById('form-title') as HTMLElement;
        this.container = document.getElementById('products-container') as HTMLElement;

        // Перевірка наявності елементів у DOM (захист від помилок підключення)
        if (!this.form || !this.container) {
            console.error("Не вдалося знайти необхідні елементи форми або контейнера в DOM.");
            return;
        }

        // Завантаження даних із localStorage при старті
        this.loadFromStorage();

        // Ініціалізація слухачів подій
        this.initEventListeners();
        
        // Первинний рендер списку
        this.render();
    }

    /**
     * Завантаження даних із localStorage
     */
    private loadFromStorage(): void {
        const data = localStorage.getItem('products');
        if (data) {
            try {
                this.products = JSON.parse(data);
                // Встановлюємо правильний наступний ID на основі існуючих даних
                if (this.products.length > 0) {
                    this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
                }
            } catch (e) {
                console.error("Помилка читання з localStorage:", e);
                this.products = [];
            }
        }
    }

    /**
     * Збереження даних у localStorage
     */
    private saveToStorage(): void {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    /**
     * Централізоване перехоплення подій
     */
    private initEventListeners(): void {
        // Обробка сабміту форми (Створення або Оновлення)
        this.form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Скасування редагування
        this.cancelBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Делегування подій для динамічних кнопок у списку (Редагувати / Видалити)
        this.container.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            
            if (target.classList.contains('edit-btn')) {
                const id = Number(target.getAttribute('data-id'));
                this.startEdit(id);
            }

            if (target.classList.contains('delete-btn')) {
                const id = Number(target.getAttribute('data-id'));
                this.deleteProduct(id);
            }
        });
    }

    /**
     * CREATE & UPDATE: Обробка відправки форми
     */
    private handleFormSubmit(): void {
        const title = this.titleInput.value.trim();
        const price = parseFloat(this.priceInput.value);
        const category = this.categoryInput.value.trim();

        // Перевірка на валідність
        if (!title || isNaN(price) || !category) {
            alert("Будь ласка, заповніть усі поля коректно!");
            return;
        }

        if (this.editingId !== null) {
            // Оновлення існуючого продукту (UPDATE)
            this.products = this.products.map(product => 
                product.id === this.editingId 
                    ? { ...product, title, price, category } 
                    : product
            );
        } else {
            // Додавання нового продукту (CREATE)
            const newProduct: IProduct = {
                id: this.nextId++,
                title,
                price,
                category
            };
            this.products.push(newProduct);
        }

        // Зберігаємо зміни у пам'яті браузера
        this.saveToStorage();

        this.resetForm();
        this.render();
    }

    /**
     * READ: Відображення списку продуктів
     */
    public render(): void {
        if (this.products.length === 0) {
            this.container.innerHTML = `<p class="test-text">test text</p>`;
            return;
        }

        this.container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-info">
                    <h3>${this.escapeHtml(product.title)}</h3>
                    <p>Ціна: ${product.price} грн | Категорія: ${this.escapeHtml(product.category)}</p>
                </div>
                <div class="product-actions">
                    <button type="button" class="edit-btn" data-id="${product.id}">Редагувати</button>
                    <button type="button" class="delete-btn" data-id="${product.id}">Видалити</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Підготовка форми для редагування продукту
     */
    private startEdit(id: number): void {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.editingId = product.id;
        this.titleInput.value = product.title;
        this.priceInput.value = product.price.toString();
        this.categoryInput.value = product.category;

        this.formTitle.textContent = "Редагувати продукт";
        this.submitBtn.textContent = "Зберегти зміни";
        this.cancelBtn.classList.remove('hidden');
        
        // Прокручуємо до форми для зручності
        this.form.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * DELETE: Видалення продукту за ID
     */
    private deleteProduct(id: number): void {
        this.products = this.products.filter(product => product.id !== id);
        
        // Якщо видаляємо елемент, який зараз редагується у формі — скидаємо форму
        if (this.editingId === id) {
            this.resetForm();
        }
        
        this.saveToStorage();
        this.render();
    }

    /**
     * Скидання форми у початковий стан (режим створення)
     */
    private resetForm(): void {
        this.editingId = null;
        this.form.reset();
        this.formTitle.textContent = "Додати новий продукт";
        this.submitBtn.textContent = "Додати продукт";
        this.cancelBtn.classList.add('hidden');
    }

    /**
     * Захист від XSS ін'єкцій
     */
    private escapeHtml(str: string): string {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
}

// Автоматична ініціалізація після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    new ProductsManager();
});