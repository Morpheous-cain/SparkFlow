# **App Name**: SparkFlow Ops

## Core Features:

- Staff Agent Check-in Portal: A web interface (mimicking a tablet UI) for agents to enter vehicle plate numbers and select multiple services using multi-select chips. Includes real-time status updates.
- Attendant Job Management PWA: A Progressive Web App for attendants to view job cards, initiate wash tasks, mark completion, and trigger payment requests (M-Pesa STK Push).
- Manager Real-time Dashboard: A comprehensive web dashboard displaying a live bay occupancy heatmap, profit/loss ticker (calculated from revenue, staff costs, and COGS), and overall operational metrics.
- Customer Web Portal & Feedback: A customer-facing web portal to check service status, view past transactions, and provide service ratings post-completion via a simple interface.
- M-Pesa Payment Integration: Integrates with the Daraja API to trigger M-Pesa STK Push for payment collection when a service is marked complete by an attendant and updates transaction status upon success.
- Automated CRM & SMS Broadcasts: Sends automated SMS messages to customers (via Twilio/AfricasTalking) based on their last visit, utilizing the 'last_visit' field for targeted communication.
- Manager Performance Insights Tool: A generative AI tool that assists managers in understanding staff performance, 'what-if' scenarios for payroll optimizations, and identifying trends in service efficiency and profitability based on collected operational data.

## Style Guidelines:

- Primary color: HSL(200, 70%, 50%) representing freshness and reliability. Converted to Hex: #3CB0D6.
- Background color: A very light, desaturated shade of the primary hue for a clean, open feel. HSL(200, 20%, 95%). Converted to Hex: #EBF3F5.
- Accent color: An analogous hue with increased saturation and reduced brightness for contrast and emphasis. HSL(230, 70%, 35%). Converted to Hex: #376FAD.
- Body and headline font: 'Inter' (sans-serif) for its modern, clean, and highly legible appearance suitable for data-rich interfaces.
- Utilize clear, minimalist line icons consistent with modern material design principles, ensuring immediate recognition for various actions and statuses across all views.
- Adopt a responsive, card-based layout system with clear information hierarchy for efficient data scanning on diverse screen sizes. Dashboards will feature grid-based organization for overview at a glance.
- Implement subtle, brief animations for state changes (e.g., job completion, payment status updates) and form interactions to provide visual feedback without distraction.