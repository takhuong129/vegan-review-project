export const Validation = (
    username: string,
    password: string,
    rePassword: string,
    email: string,
    phone: string,
) => {
    const validate = () => {
        const errors: string[] = [];

        // Username validation
        if (username.trim().length < 4) {
            errors.push('Tên đăng nhập phải trên 3 ký tự');
        }

        // Password validation
        if (password.trim().length < 6) {
            errors.push('Mật khẩu phải có trên 6 kí tự');
        }

        // Password match validation
        if (password !== rePassword) {
            errors.push('Nhập lại mật khẩu không khớp');
        }

        // Email validation using a basic regex
        if (!isValidEmail(email)) {
            errors.push('Email không hợp lệ');
        }

        // Vietnam phone number format validation
        if (!isValidVietnamPhone(phone)) {
            errors.push('Số điện thoại không hợp lệ');
        }

        return errors;
    };

    const isValidEmail = (email: string) => {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidVietnamPhone = (phone: string) => {
        // Vietnam phone number format regex (assuming 10 digits starting with 0)
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const errors = validate();
    return errors;
};
