// ============================================================
// ========== SOLID ==================================================
// ========== S ==============================
// 1️⃣ Логування і бізнес-логіка:
// Створи клас, який відповідає за обробку замовлень (order). Зараз у ньому також виконується логування дій.
// Розділи функціональність так, щоб логування стало окремим компонентом.
// ❌ Неправильна реалізація — один клас робить і обробку, і логування
// class OrderServiceBad {
//   processOrder(orderId: number) {
//     console.log(`Processing order #${orderId}`);
//     this.logAction(`Order ${orderId} has been processed`);
//   }

//   private logAction(message: string) {
//     const timestamp = new Date().toISOString();
//     console.log(`[${timestamp}] LOG: ${message}`);
//   }
// }

class OrderService {
    private logger = new Logger();

    processOrder(orderId: number): void {
        console.log(`Processing order #${orderId}`);
        this.logger.logAction(`Order ${orderId} has been processed`);
    }
}
class Logger {
    logAction(message: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] LOG: ${message}`);
    }
}

// 2️⃣ Збереження та валідація:
// Є клас UserManager, який одночасно перевіряє валідність email і зберігає користувачів у базу.
// Виділи перевірку в окремий клас-валідатор.
// ❌ Неправильна реалізація — перевірка email і збереження у базу в одному класі
// class UserManagerBad {
//   saveUser(email: string) {
//     if (!email.includes("@") || !email.includes(".")) {
//       console.log("Invalid email format!");
//       return;
//     }
//     console.log(`Saving user with email: ${email} to database...`);
//   }
// }

// Окремий клас для валідації
class UserValidator {
    validateEmail(email: string): boolean {
        return email.includes("@") && email.includes(".");
    }
}
class UserManager {
    private validator = new UserValidator();

    saveUser(email: string): void {
        if (!this.validator.validateEmail(email)) {
            console.log("Invalid email format!");
            return;
        }
        console.log(`Saving user with email: ${email} to database...`);
    }
}

// 3️⃣ Робота з файлами:
// Є клас, який читає дані з файлу, форматує їх і виводить на екран.
// Розбий обов’язки на три класи: читання, форматування, вивід.
// ❌ Неправильна реалізація — один клас відповідає за всі три етапи
// class FileProcessorBad {
//   processFile(filePath: string) {
//     const data = this.readFile(filePath);
//     const formatted = this.formatData(data);
//     this.printData(formatted);
//   }

//   private readFile(path: string): string {
//     console.log(`Reading file: ${path}`);
//     return "raw data from file";
//   }

//   private formatData(data: string): string {
//     console.log("Formatting data...");
//     return data.toUpperCase();
//   }

//   private printData(data: string) {
//     console.log("Printing formatted data:\n", data);
//   }
// }

// 1. Клас для читання файлу
class FileReaderClass {
    readFile(path: string): string {
        console.log(`Reading file: ${path}`);
        return "raw data from file";
    }
}

// 2. Клас для форматування даних
class DataFormatter {
    formatData(data: string): string {
        console.log("Formatting data...");
        return data.toUpperCase();
    }
}

// 3. Клас для виведення даних
class DataPrinter {
    printData(data: string): void {
        console.log("Printing formatted data:\n", data);
    }
}

// Головний клас, який координує роботу компонентів
class FileProcessor {
    private reader = new FileReaderClass();
    private formatter = new DataFormatter();
    private printer = new DataPrinter();

    processFile(filePath: string): void {
        const data = this.reader.readFile(filePath);
        const formatted = this.formatter.formatData(data);
        this.printer.printData(formatted);
    }
}

// 4️⃣ Повідомлення користувачів:
// Клас NotificationService одночасно генерує повідомлення, надсилає його й записує в історію.
// Розділи ці частини, щоб кожен клас відповідав лише за один етап.
// ❌ Неправильна реалізація — усі три обов’язки в одному класі
// class NotificationServiceBad {
//   sendNotification(user: string, message: string) {
//     const fullMessage = this.createMessage(user, message);
//     this.send(fullMessage);
//     this.saveHistory(fullMessage);
//   }

//   private createMessage(user: string, msg: string): string {
//     return `To ${user}: ${msg}`;
//   }

//   private send(msg: string) {
//     console.log("Sending:", msg);
//   }

//   private saveHistory(msg: string) {
//     console.log("Saving to history:", msg);
//   }
// }

// 1. Клас для генерації повідомлення
class MessageBuilder {
    createMessage(user: string, msg: string): string {
        return `To ${user}: ${msg}`;
    }
}

// 2. Клас для надсилання повідомлення
class MessageSender {
    send(msg: string): void {
        console.log("Sending:", msg);
    }
}

// 3. Клас для збереження в історію
class HistoryLogger {
    saveHistory(msg: string): void {
        console.log("Saving to history:", msg);
    }
}

// Головний сервіс повідомлень
class NotificationService {
    private builder = new MessageBuilder();
    private sender = new MessageSender();
    private history = new HistoryLogger();

    sendNotification(user: string, message: string): void {
        const fullMessage = this.builder.createMessage(user, message);
        this.sender.send(fullMessage);
        this.history.saveHistory(fullMessage);
    }
}

// 5️⃣ Формування звітів:
// Клас ReportGenerator збирає дані, форматує у PDF і відправляє поштою.
// Виділи окремо модуль збору, модуль форматування і модуль надсилання.
// ❌ Неправильна реалізація — один клас робить усе одразу
// class ReportGeneratorBad {
//   generateAndSendReport() {
//     const data = this.collectData();
//     const pdf = this.formatToPDF(data);
//     this.sendByEmail(pdf);
//   }

//   private collectData(): string {
//     console.log("Collecting report data...");
//     return "sales data";
//   }

//   private formatToPDF(data: string): string {
//     console.log("Formatting to PDF...");
//     return `PDF(${data})`;
//   }

//   private sendByEmail(report: string) {
//     console.log("Sending report via email:", report);
//   }
// }

// 1. Клас для збору даних
class DataCollector {
    collectData(): string {
        console.log("Collecting report data...");
        return "sales data";
    }
}

// 2. Клас для форматування у PDF
class PDFFormatter {
    formatToPDF(data: string): string {
        console.log("Formatting to PDF...");
        return `PDF(${data})`;
    }
}

// 3. Клас для надсилання поштою
class EmailSender {
    sendByEmail(report: string): void {
        console.log("Sending report via email:", report);
    }
}

// Головний клас для генерації та надсилання звіту
class ReportGenerator {
    private collector = new DataCollector();
    private formatter = new PDFFormatter();
    private sender = new EmailSender();

    generateAndSendReport(): void {
        const data = this.collector.collectData();
        const pdf = this.formatter.formatToPDF(data);
        this.sender.sendByEmail(pdf);
    }
}

// ============================================================
// ========== O: Open / Closed (порушення принципу)
// ============================================================

// 1️⃣ Платіжні системи:
// Є клас PaymentProcessor, який у методі process() перевіряє тип платіжної системи (visa, paypal, applePay).
// Реорганізуй код так, щоб можна було додавати нові платіжні системи без зміни PaymentProcessor.

/*
class PaymentProcessorBad {
  process(amount: number, type: string) {
    if (type === "visa") {
      console.log("Processing Visa payment:", amount);
    } else if (type === "paypal") {
      console.log("Processing PayPal payment:", amount);
    } else if (type === "applePay") {
      console.log("Processing ApplePay payment:", amount);
    } else {
      console.log("Unknown payment type!");
    }
  }
}
*/

// Інтерфейс для платіжних систем
interface PaymentMethod {
    processPayment(amount: number): void;
}

// Окремі класи для кожного типу платежу
class VisaPayment implements PaymentMethod {
    processPayment(amount: number): void {
        console.log("Processing Visa payment:", amount);
    }
}

class PayPalPayment implements PaymentMethod {
    processPayment(amount: number): void {
        console.log("Processing PayPal payment:", amount);
    }
}

class ApplePayPayment implements PaymentMethod {
    processPayment(amount: number): void {
        console.log("Processing ApplePay payment:", amount);
    }
}

// Універсальний процесор, відкритий для розширення, але закритий для модифікації
class PaymentProcessor {
    process(amount: number, paymentMethod: PaymentMethod): void {
        paymentMethod.processPayment(amount);
    }
}

// 2️⃣ Експорт звітів:
// Клас Exporter вміє експортувати лише у JSON.
// Розроби архітектуру, щоб можна було легко додати експорт у CSV або XML без зміни коду Exporter.

/*
class ExporterBad {
  export(data: any, format: string) {
    if (format === "json") {
      console.log("Exporting to JSON:", JSON.stringify(data));
    } else if (format === "csv") {
      console.log("Exporting to CSV:", Object.values(data).join(","));
    } else {
      console.log("Unsupported format!");
    }
  }
}
*/

// Інтерфейс для форматів експорту
interface ExportStrategy {
    exportData(data: any): void;
}

// Окремі класи для кожного формату
class JsonExporter implements ExportStrategy {
    exportData(data: any): void {
        console.log("Exporting to JSON:", JSON.stringify(data));
    }
}

class CsvExporter implements ExportStrategy {
    exportData(data: any): void {
        console.log("Exporting to CSV:", Object.values(data).join(","));
    }
}

// Головний клас, який не потрібно змінювати при додаванні нових форматів
class Exporter {
    export(data: any, strategy: ExportStrategy): void {
        strategy.exportData(data);
    }
}

// 3️⃣ Розрахунок податків:
// Клас TaxCalculator перевіряє тип компанії і рахує податки по-різному.
// Впровадь поліморфізм так, щоб нові види компаній можна було додавати окремо.

/*
class TaxCalculatorBad {
  calculate(companyType: string, amount: number) {
    if (companyType === "small") {
      return amount * 0.1;
    } else if (companyType === "corporation") {
      return amount * 0.2;
    } else if (companyType === "nonprofit") {
      return 0;
    } else {
      throw new Error("Unknown company type");
    }
  }
}
*/

// Інтерфейс для розрахунку податків
interface TaxCalculationStrategy {
    calculate(amount: number): number;
}

// Окремі класи для кожного типу компанії
class SmallCompanyTax implements TaxCalculationStrategy {
    calculate(amount: number): number {
        return amount * 0.1;
    }
}

class CorporationTax implements TaxCalculationStrategy {
    calculate(amount: number): number {
        return amount * 0.2;
    }
}

class NonprofitTax implements TaxCalculationStrategy {
    calculate(amount: number): number {
        return 0;
    }
}

// Головний калькулятор, відкритий для розширення
class TaxCalculator {
    calculate(amount: number, strategy: TaxCalculationStrategy): number {
        return strategy.calculate(amount);
    }
}

// 4️⃣ Відображення повідомлень:
// Компонент MessageDisplay у методі render() має if-умови для типів повідомлень (success, error, warning).
// Побудуй систему, де кожен тип повідомлення має власний клас.

/*
class MessageDisplayBad {
  render(type: string, text: string) {
    if (type === "success") {
      console.log("✅ Success:", text);
    } else if (type === "error") {
      console.log("❌ Error:", text);
    } else if (type === "warning") {
      console.log("⚠️ Warning:", text);
    } else {
      console.log("ℹ️ Info:", text);
    }
  }
}
*/

// Інтерфейс для відображення повідомлень
interface MessageRenderer {
    render(text: string): void;
}

// Окремі класи для кожного типу повідомлення
class SuccessMessage implements MessageRenderer {
    render(text: string): void {
        console.log("✅ Success:", text);
    }
}

class ErrorMessage implements MessageRenderer {
    render(text: string): void {
        console.log("❌ Error:", text);
    }
}

class WarningMessage implements MessageRenderer {
    render(text: string): void {
        console.log("⚠️ Warning:", text);
    }
}

class InfoMessage implements MessageRenderer {
    render(text: string): void {
        console.log("ℹ️ Info:", text);
    }
}

// Головний компонент, відкритий для розширення
class MessageDisplay {
    render(text: string, renderer: MessageRenderer): void {
        renderer.render(text);
    }
}

// 5️⃣ Знижки для клієнтів:
// Клас DiscountManager має кілька умов для різних клієнтів (нові, постійні, VIP).
// Реорганізуй код через інтерфейс “стратегії знижок”, щоб додати новий тип знижки без зміни базового класу.

/*
class DiscountManagerBad {
  getPrice(customerType: string, price: number): number {
    if (customerType === "new") {
      return price * 0.95;
    } else if (customerType === "regular") {
      return price * 0.9;
    } else if (customerType === "vip") {
      return price * 0.8;
    } else {
      return price;
    }
  }
}
*/

// Інтерфейс для стратегії знижок
interface DiscountStrategy {
    calculatePrice(price: number): number;
}

// Окремі класи для кожного типу клієнта
class NewCustomerDiscount implements DiscountStrategy {
    calculatePrice(price: number): number {
        return price * 0.95;
    }
}

class RegularCustomerDiscount implements DiscountStrategy {
    calculatePrice(price: number): number {
        return price * 0.9;
    }
}

class VipCustomerDiscount implements DiscountStrategy {
    calculatePrice(price: number): number {
        return price * 0.8;
    }
}

// Головний менеджер знижок, відкритий для розширення
class DiscountManager {
    getPrice(price: number, discountStrategy: DiscountStrategy): number {
        return discountStrategy.calculatePrice(price);
    }
}

// ============================================================
// ========== L: Liskov Substitution (порушення принципу)
// ============================================================

// 1️⃣ Птахи (інше формулювання):
// Ієрархія Bird → Eagle, Penguin.
// Потрібно, щоб жоден підклас не порушував поведінку базового класу, якщо його підставити замість Bird.

/*
class BirdBad {
  fly() { console.log("Flying..."); }
}
class EagleBad extends BirdBad {}
class PenguinBad extends BirdBad {
  fly() { throw new Error("Penguins can't fly!"); } // ❌ порушення LSP
}
*/

// Базовий клас для всіх птахів
class Bird {
    eat(): void {
        console.log("Eating...");
    }
}

// Проміжний клас для птахів, які вміють літати
class FlyingBird extends Bird {
    fly(): void {
        console.log("Flying...");
    }
}

// Орел успадковує здатність літати
class Eagle extends FlyingBird {}

// Пінгвін успадковує лише загальні властивості птаха, не порушуючи контракт
class Penguin extends Bird {}

// 2️⃣ Фігури:
// Є базовий клас Shape із методом getArea().
// Підкласи Rectangle і Square поводяться некоректно при підстановці одного замість іншого.
/*
class RectangleBad {
  constructor(public width: number, public height: number) {}
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  getArea() { return this.width * this.height; }
}
class SquareBad extends RectangleBad {
  setWidth(w: number) {
    this.width = this.height = w; // ❌ змінює поведінку Rectangle
  }
  setHeight(h: number) {
    this.width = this.height = h; // ❌ зламує контракт батьківського класу
  }
}
*/

// Загальний інтерфейс для всіх фігур
interface Shape {
    getArea(): number;
}

// Прямокутник
class Rectangle implements Shape {
    constructor(public width: number, public height: number) {}

    setWidth(w: number): void {
        this.width = w;
    }

    setHeight(h: number): void {
        this.height = h;
    }

    getArea(): number {
        return this.width * this.height;
    }
}

// Квадрат існує окремо і не ламає очікувань користувача прямокутника
class Square implements Shape {
    constructor(public side: number) {}

    setSide(s: number): void {
        this.side = s;
    }

    getArea(): number {
        return this.side * this.side;
    }
}

// 3️⃣ Платежі:
// Клас Payment має метод refund().
// Деякі підкласи (GiftCardPayment) не підтримують повернення коштів і викидають помилки.
// Перепроєктуй ієрархію, щоб уникнути цього.

/*
class PaymentBad {
  refund() { console.log("Refund completed"); }
}
class GiftCardPaymentBad extends PaymentBad {
  refund() { throw new Error("Gift cards cannot be refunded!"); } // ❌
}
*/

// Базовий клас для всіх платежів
class Payment {
    processPayment(amount: number): void {
        console.log(`Processing payment of ${amount}`);
    }
}

// Інтерфейс для платежів, які підтримують повернення коштів
interface Refundable {
    refund(): void;
}

// Звичайна картка підтримує повернення
class CreditCardPayment extends Payment implements Refundable {
    refund(): void {
        console.log("Refund completed for Credit Card");
    }
}

// Подарункова картка успадковує Payment, але НЕ реалізує Refundable, тому нічого не ламає
class GiftCardPayment extends Payment {
}

// 4️⃣ Рахунки:
// Базовий клас Account має метод withdraw().
// Для типу SavingsAccount потрібно обмеження (не можна перевищувати ліміт).
// Як зробити, щоб при використанні Account замість SavingsAccount програма не ламалася?

/*
class AccountBad {
  balance: number = 1000;
  withdraw(amount: number) { this.balance -= amount; }
}
class SavingsAccountBad extends AccountBad {
  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Not enough funds"); // ❌ зміна очікуваної поведінки
    this.balance -= amount;
  }
}
*/

// Базовий клас рахунку
class Account {
    protected balance: number = 1000;

    withdraw(amount: number): void {
        this.balance -= amount;
        console.log(`Withdrawn: ${amount}. Remaining balance: ${this.balance}`);
    }

    getBalance(): number {
        return this.balance;
    }
}

// Накопичувальний рахунок з додатковою логікою перевірки ліміту
class SavingsAccount extends Account {
    withdraw(amount: number): void {
        if (amount > this.balance) {
            console.log("Error: Not enough funds in Savings Account!");
            return;
        }
        this.balance -= amount;
        console.log(`Savings withdrawn: ${amount}. Remaining balance: ${this.balance}`);
    }
}

// 5️⃣ Транспорт:
// Є клас Vehicle з методом drive().
// Bicycle і Car працюють нормально, але Boat не може реалізувати цей метод коректно.

/*
class VehicleBad {
  drive() { console.log("Driving..."); }
}
class CarBad extends VehicleBad {}
class BicycleBad extends VehicleBad {}
class BoatBad extends VehicleBad {
  drive() { throw new Error("Boats can't drive on roads!"); } // ❌
}
*/

// Базовий клас для транспорту
class Vehicle {
    startEngine(): void {
        console.log("Starting engine or preparation...");
    }
}

// Інтерфейс для транспорту, який їздить
interface Drivable {
    drive(): void;
}

// Інтерфейс для транспорту, який пливе
interface Sailable {
    sail(): void;
}

// Машина їздить
class Car extends Vehicle implements Drivable {
    drive(): void {
        console.log("Driving on the road...");
    }
}

// Велосипед їздить
class Bicycle implements Drivable {
    drive(): void {
        console.log("Pedaling on the road...");
    }
}

// Човен пливе
class Boat implements Sailable {
    sail(): void {
        console.log("Sailing on the water...");
    }
}

// ============================================================
// ========== I: Interface Segregation (порушення принципу)
// ============================================================

// 1️⃣ Пристрої введення:
// Є інтерфейс InputDevice з методами click(), type(), swipe().
// Розділи цей інтерфейс на окремі — для миші, клавіатури і сенсорного екрана.

/*
interface InputDeviceBad {
  click(): void;
  type(data: string): void;
  swipe(): void;
}
class MouseBad implements InputDeviceBad {
  click() { console.log("Mouse click"); }
  type(data: string) { throw new Error("Mouse can't type!"); } // ❌
  swipe() { throw new Error("Mouse can't swipe!"); } // ❌
}
*/

interface Clickable {
    click(): void;
}

interface Typable {
    type(data: string): void;
}

interface Swipeable {
    swipe(): void;
}

// Класи реалізують лише ті інтерфейси, які їм дійсно потрібні
class Mouse implements Clickable {
    click(): void {
        console.log("Mouse click");
    }
}

class Keyboard implements Typable {
    type(data: string): void {
        console.log("Typing:", data);
    }
}

class Touchscreen implements Clickable, Swipeable {
    click(): void {
        console.log("Touch screen tap");
    }

    swipe(): void {
        console.log("Touch screen swipe");
    }
}

// 2️⃣ Друк і сканування:
// Інтерфейс OfficeMachine має методи print(), scan(), fax().
// Клас SimplePrinter реалізує лише print(), решта не потрібні.

/*
interface OfficeMachineBad {
  print(): void;
  scan(): void;
  fax(): void;
}
class SimplePrinterBad implements OfficeMachineBad {
  print() { console.log("Printing..."); }
  scan() { throw new Error("No scanner!"); } // ❌
  fax() { throw new Error("No fax!"); } // ❌
}
*/

interface Printer {
    print(): void;
}

interface Scanner {
    scan(): void;
}

interface FaxMachine {
    fax(): void;
}

// Простий принтер реалізує лише друк
class SimplePrinter implements Printer {
    print(): void {
        console.log("Printing...");
    }
}

class MultiFunctionPrinter implements Printer, Scanner, FaxMachine {
    print(): void {
        console.log("Printing...");
    }

    scan(): void {
        console.log("Scanning...");
    }

    fax(): void {
        console.log("Sending fax...");
    }
}

// 3️⃣ Мультимедіа-плеєр:
// Інтерфейс MediaPlayer містить playAudio(), playVideo(), recordAudio().

/*
interface MediaPlayerBad {
  playAudio(): void;
  playVideo(): void;
  recordAudio(): void;
}
class AudioPlayerBad implements MediaPlayerBad {
  playAudio() { console.log("Playing audio"); }
  playVideo() { throw new Error("Audio player can't play video"); } // ❌
  recordAudio() { throw new Error("Audio player can't record"); } // ❌
}
*/

// Спеціалізовані інтерфейси
interface AudioPlayer {
    playAudio(): void;
}

interface VideoPlayer {
    playVideo(): void;
}

interface AudioRecorder {
    recordAudio(): void;
}

// Аудіоплеєр реалізує лише те, що вміє
class SimpleAudioPlayer implements AudioPlayer {
    playAudio(): void {
        console.log("Playing audio");
    }
}

// Повноцінний медіацентр може реалізовувати всі необхідні інтерфейси
class AdvancedMediaPlayer implements AudioPlayer, VideoPlayer, AudioRecorder {
    playAudio(): void {
        console.log("Playing audio");
    }

    playVideo(): void {
        console.log("Playing video");
    }

    recordAudio(): void {
        console.log("Recording audio");
    }
}

// 4️⃣ Платформи повідомлень:
// Інтерфейс Messenger має методи sendEmail(), sendSMS(), sendPush().

/*
interface MessengerBad {
  sendEmail(msg: string): void;
  sendSMS(msg: string): void;
  sendPush(msg: string): void;
}
class EmailMessengerBad implements MessengerBad {
  sendEmail(m: string) { console.log("Email:", m); }
  sendSMS(m: string) { throw new Error("Not supported"); } // ❌
  sendPush(m: string) { throw new Error("Not supported"); } // ❌
}
*/

interface EmailSender {
    sendEmail(msg: string): void;
}

interface SmsSender {
    sendSMS(msg: string): void;
}

interface PushSender {
    sendPush(msg: string): void;
}

class EmailMessenger implements EmailSender {
    sendEmail(msg: string): void {
        console.log("Email:", msg);
    }
}

class UniversalMessenger implements EmailSender, SmsSender, PushSender {
    sendEmail(msg: string): void {
        console.log("Email:", msg);
    }

    sendSMS(msg: string): void {
        console.log("SMS:", msg);
    }

    sendPush(msg: string): void {
        console.log("Push:", msg);
    }
}

// 5️⃣ Тварини:
// Інтерфейс Animal містить walk(), fly(), swim().
// Розбий інтерфейс так, щоб кожна тварина реалізовувала лише релевантні методи.

/*
interface AnimalBad {
  walk(): void;
  fly(): void;
  swim(): void;
}
class DogBad implements AnimalBad {
  walk() { console.log("Dog walking"); }
  fly() { throw new Error("Dog can't fly"); } // ❌
  swim() { console.log("Dog swimming"); }
}
*/

interface Walkable {
    walk(): void;
}

interface Flyable {
    fly(): void;
}

interface Swimmable {
    swim(): void;
}

class Dog implements Walkable, Swimmable {
    walk(): void {
        console.log("Dog walking");
    }

    swim(): void {
        console.log("Dog swimming");
    }
}

class Duck implements Walkable, Flyable, Swimmable {
    walk(): void {
        console.log("Duck walking");
    }

    fly(): void {
        console.log("Duck flying");
    }

    swim(): void {
        console.log("Duck swimming");
    }
}

// ============================================================
// ========== D: Dependency Inversion (порушення принципу)
// ============================================================

// 1️⃣ Зберігання даних:
// Клас UserManager напряму використовує MySQLService.

/*
class MySQLServiceBad {
  save(data: string) { console.log("Saving to MySQL:", data); }
}
class UserManagerBad {
  private db = new MySQLServiceBad(); // ❌ жорстка залежність
  addUser(name: string) { this.db.save(name); }
}
*/

interface Database {
    save(data: string): void;
}

// реалізація для MySQL
class MySQLService implements Database {
    save(data: string): void {
        console.log("Saving to MySQL:", data);
    }
}

// реалізація для MongoDB
class MongoService implements Database {
    save(data: string): void {
        console.log("Saving to MongoDB:", data);
    }
}

// клас залежить від абстракції, а не від конкретної бази
class UserManager {
    private db: Database;

    constructor(db: Database) {
        this.db = db; // Передаємо залежність ззовні (Dependency Injection)
    }

    addUser(name: string): void {
        this.db.save(name);
    }
}

// 2️⃣ Надсилання повідомлень:
// NotificationService напряму створює EmailSender і SMSSender.

/*
class EmailSenderBad { send(msg: string) { console.log("Email:", msg); } }
class SMSSenderBad { send(msg: string) { console.log("SMS:", msg); } }
class NotificationServiceBad {
  sendNotification(msg: string, type: string) {
    if (type === "email") new EmailSenderBad().send(msg);
    else if (type === "sms") new SMSSenderBad().send(msg);
  }
}
*/

interface MessageSender {
    send(msg: string): void;
}

class EmailSender implements MessageSender {
    send(msg: string): void {
        console.log("Email:", msg);
    }
}

class SMSSender implements MessageSender {
    send(msg: string): void {
        console.log("SMS:", msg);
    }
}

class NotificationService {
    constructor(private sender: MessageSender) {}

    sendNotification(msg: string): void {
        this.sender.send(msg);
    }
}

// 3️⃣ Логування:
// Клас OrderService напряму викликає ConsoleLogger.

/*
class ConsoleLoggerBad {
  log(msg: string) { console.log("Console:", msg); }
}
class OrderServiceBad {
  private logger = new ConsoleLoggerBad(); // ❌ прив’язка до конкретної реалізації
  createOrder() { this.logger.log("Order created"); }
}
*/

interface Logger {
    log(msg: string): void;
}

class ConsoleLogger implements Logger {
    log(msg: string): void {
        console.log("Console:", msg);
    }
}

class OrderService {
    constructor(private logger: Logger) {}

    createOrder(): void {
        this.logger.log("Order created");
    }
}

// 4️⃣ Обробка платежів:
// Клас Checkout напряму залежить від PayPalPayment.

/*
class PayPalPaymentBad {
  pay(amount: number) { console.log("PayPal paid:", amount); }
}
class CheckoutBad {
  private processor = new PayPalPaymentBad(); // ❌ жорстка залежність
  process(amount: number) { this.processor.pay(amount); }
}
*/

interface PaymentProcessor {
    pay(amount: number): void;
}

class PayPalPayment implements PaymentProcessor {
    pay(amount: number): void {
        console.log("PayPal paid:", amount);
    }
}

class StripePayment implements PaymentProcessor {
    pay(amount: number): void {
        console.log("Stripe paid:", amount);
    }
}

// Checkout залежить від абстракції, а не від конкретної платіжної системи
class Checkout {
    constructor(private processor: PaymentProcessor) {}

    process(amount: number): void {
        this.processor.pay(amount);
    }
}

// 5️⃣ Робота із зовнішніми API:
// Клас WeatherApp напряму викликає OpenWeatherAPI.

/*
class OpenWeatherAPIBad {
  getTemperature(city: string) { console.log(`${city}: 25°C`); }
}
class WeatherAppBad {
  private api = new OpenWeatherAPIBad(); // ❌ неможливо замінити на інший API
  showWeather(city: string) { this.api.getTemperature(city); }
}
*/

interface WeatherService {
    getTemperature(city: string): void;
}

// Конкретна реалізація для OpenWeather
class OpenWeatherAPI implements WeatherService {
    getTemperature(city: string): void {
        console.log(`${city}: 25°C (OpenWeather)`);
    }
}

// Інша реалізація наприклад, Weatherstack
class WeatherstackAPI implements WeatherService {
    getTemperature(city: string): void {
        console.log(`${city}: 24°C (Weatherstack)`);
    }
}

// Додаток залежить від абстракції, а не від конкретного API
class WeatherApp {
    constructor(private weatherService: WeatherService) {}

    showWeather(city: string): void {
        this.weatherService.getTemperature(city);
    }
}