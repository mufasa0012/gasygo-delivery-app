# GasyGo - Gas Delivery App

This is a Next.js application for a gas delivery service called GasyGo, built in Firebase Studio. It features a customer-facing ordering system and an admin dashboard for managing products, orders, and drivers.

## Features

- **Product Catalog**: Browse and order gas cylinders and accessories.
- **Shopping Cart**: Add products to a cart and proceed to checkout.
- **Admin Dashboard**: A secure area to manage products, view orders, and oversee drivers.
- **Image Uploads**: Product image management is handled by [ImageKit.io](https://imagekit.io/).
- **AI-Powered Features**:
  - Order intent recognition from unstructured text.
  - Delivery time estimation.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gasygo-delivery-app.git
    cd gasygo-delivery-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your secret keys. You can get these from your ImageKit.io dashboard.

    ```bash
    # .env.local

    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="YOUR_URL_ENDPOINT"
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="YOUR_PUBLIC_KEY"
    IMAGEKIT_PRIVATE_KEY="YOUR_PRIVATE_KEY"
    ```

    The public keys are also present in the `.env` file, but `.env.local` will override them and is the standard place for all environment variables.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Image Management**: [ImageKit.io](https://imagekit.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
