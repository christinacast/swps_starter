/**
 * Validates the address input.
 * @param {string} address - The address string to validate.
 * @returns {Object} - Returns an object with `isValid` (boolean) and `message` (string).
 */

function validateAddressInput(address) {
    if (!address.trim()) {
        return { isValid: false, message: "Address cannot be empty." };
    }

    const regex = /^[a-zA-Z0-9\s,.'ßÄäÜüÖö -]+$/; // Allows letters, numbers, spaces, and common address symbols
    if (!regex.test(address)) {
        return { isValid: false, message: "Address contains invalid characters." };
    }

    if (address.length < 3) {
        return { isValid: false, message: "Address must be at least 3 characters long." };
    }

    return { isValid: true, message: "" }; // Valid input
}

export { validateAddressInput };