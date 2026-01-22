import { faker } from '@faker-js/faker';

/**
 * TestDataFactory - Factory Pattern
 * 
 * This class uses the Factory design pattern to generate test data.
 * It provides methods to create various types of test data objects
 * with realistic values using Faker.js.
 * 
 * Key Features:
 * - Centralized test data generation
 * - Realistic data using Faker
 * - Reusable data builders
 * - Type-safe data objects
 */

// Type definitions for test data
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    username: string;
}

export interface AddressData {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface CreditCardData {
    number: string;
    cvv: string;
    expiryMonth: string;
    expiryYear: string;
    cardholderName: string;
}

export interface ProductData {
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    inStock: boolean;
}

export interface CompanyData {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: AddressData;
}

export class TestDataFactory {
    private static instance: TestDataFactory;

    private constructor() { }

    /**
     * Get singleton instance
     */
    public static getInstance(): TestDataFactory {
        if (!TestDataFactory.instance) {
            TestDataFactory.instance = new TestDataFactory();
        }
        return TestDataFactory.instance;
    }

    /**
     * Generate random user data
     * @param overrides - Optional overrides for specific fields
     */
    createUser(overrides?: Partial<UserData>): UserData {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        return {
            firstName,
            lastName,
            email: faker.internet.email({ firstName, lastName }),
            password: this.generateSecurePassword(),
            phone: faker.phone.number(),
            dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
            username: faker.internet.userName({ firstName, lastName }),
            ...overrides,
        };
    }

    /**
     * Generate random address data
     * @param overrides - Optional overrides for specific fields
     */
    createAddress(overrides?: Partial<AddressData>): AddressData {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
            ...overrides,
        };
    }

    /**
     * Generate random credit card data
     * @param overrides - Optional overrides for specific fields
     */
    createCreditCard(overrides?: Partial<CreditCardData>): CreditCardData {
        const currentYear = new Date().getFullYear();

        return {
            number: faker.finance.creditCardNumber(),
            cvv: faker.finance.creditCardCVV(),
            expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),
            expiryYear: faker.number.int({ min: currentYear, max: currentYear + 5 }).toString(),
            cardholderName: faker.person.fullName(),
            ...overrides,
        };
    }

    /**
     * Generate random product data
     * @param overrides - Optional overrides for specific fields
     */
    createProduct(overrides?: Partial<ProductData>): ProductData {
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            category: faker.commerce.department(),
            sku: faker.string.alphanumeric(10).toUpperCase(),
            inStock: faker.datatype.boolean(),
            ...overrides,
        };
    }

    /**
     * Generate random company data
     * @param overrides - Optional overrides for specific fields
     */
    createCompany(overrides?: Partial<CompanyData>): CompanyData {
        return {
            name: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            website: faker.internet.url(),
            address: this.createAddress(),
            ...overrides,
        };
    }

    /**
     * Generate secure password
     * @param length - Password length (default: 12)
     */
    generateSecurePassword(length: number = 12): string {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        const allChars = uppercase + lowercase + numbers + symbols;

        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Generate random email
     * @param domain - Optional domain (default: random)
     */
    generateEmail(domain?: string): string {
        return domain
            ? faker.internet.email({ provider: domain })
            : faker.internet.email();
    }

    /**
     * Generate random phone number
     * @param format - Optional format
     */
    generatePhone(format?: string): string {
        return format
            ? faker.phone.number(format)
            : faker.phone.number();
    }

    /**
     * Generate random date
     * @param past - Generate past date (default: true)
     * @param years - Number of years range
     */
    generateDate(past: boolean = true, years: number = 10): string {
        const date = past
            ? faker.date.past({ years })
            : faker.date.future({ years });
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate random text
     * @param sentences - Number of sentences
     */
    generateText(sentences: number = 3): string {
        return faker.lorem.sentences(sentences);
    }

    /**
     * Generate random number
     * @param min - Minimum value
     * @param max - Maximum value
     */
    generateNumber(min: number = 0, max: number = 100): number {
        return faker.number.int({ min, max });
    }

    /**
     * Generate random boolean
     */
    generateBoolean(): boolean {
        return faker.datatype.boolean();
    }

    /**
     * Generate random UUID
     */
    generateUUID(): string {
        return faker.string.uuid();
    }

    /**
     * Generate array of items
     * @param factory - Factory function to generate items
     * @param count - Number of items
     */
    generateArray<T>(factory: () => T, count: number): T[] {
        return Array.from({ length: count }, factory);
    }

    /**
     * Pick random item from array
     * @param items - Array of items
     */
    pickRandom<T>(items: T[]): T {
        return faker.helpers.arrayElement(items);
    }

    /**
     * Shuffle array
     * @param items - Array to shuffle
     */
    shuffle<T>(items: T[]): T[] {
        return faker.helpers.shuffle(items);
    }
}

// Export singleton instance
export const testDataFactory = TestDataFactory.getInstance();
