# Pathfinder - Public Transport Bot
## Team Angel Kakis

Pathfinder is a Telegram bot designed to help users plan their public transport routes, provide feedback, and more. This bot leverages the Telegram Bot API and can be deployed on an AWS EC2 instance.

## Features

- Plan a public transport route
- Share location or manually enter starting point
- View detailed trip information
- Provide feedback with ratings
- Real-time notifications during the trip

## Prerequisites

- Node.js and npm installed
- A Telegram bot token from BotFather
- AWS account with an EC2 instance set up
- SSH access to your EC2 instance

## Getting Started

### Cloning the Repository

```sh
git clone https://github.com/Asylumreid/hackkakis-round2.git
cd hackkakis-round2
```

### Installing Dependencies

```sh
npm install

### Running the Bot Locally

```sh
node bot.js
```

## Deployment to AWS EC2

### Setting Up Your EC2 Instance

1. **Launch an EC2 Instance**:
   - Go to the AWS Management Console.
   - Navigate to EC2 and launch a new instance.
   - Choose an Amazon Machine Image (AMI), such as Amazon Linux 2 AMI.
   - Select an instance type (e.g., t2.micro for free tier).
   - Configure instance details, add storage, and configure security group to allow SSH (port 22) and your bot's port (default is 80 or 443 for HTTPS).
   - Launch the instance and download the key pair (.pem file).

2. **Connect to Your EC2 Instance**:
   - Open a terminal and connect to your instance using SSH:
     ```sh
     ssh -i /path/to/your-key-pair.pem ec2-user@your-ec2-public-ip
     ```

### Setting Up the Bot on EC2

1. **Update and Install Dependencies**:
   ```sh
   sudo yum update -y
   sudo yum install -y git
   curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **Clone Your Repository**:
   ```sh
   git clone https://github.com/Asylumreid/hackkakis-round2.git
   cd hackkakis-round2
   ```

3. **Install Project Dependencies**:
   ```sh
   npm install
   ```

4. **Run the Bot**:
   ```sh
   node bot.js
   ```

### Running the Bot in the Background

To keep your bot running even after you disconnect from the SSH session, you can use a process manager like `pm2`.

1. **Install `pm2`**:
   ```sh
   sudo npm install -g pm2
   ```

2. **Start the Bot with `pm2`**:
   ```sh
   pm2 start bot.js --name pathfinder-bot
   ```

3. **Save the `pm2` Process List and Enable Startup Script**:
   ```sh
   pm2 save
   pm2 startup
   ```

### Updating the Bot

Whenever you need to update the bot, follow these steps:

1. **Connect to Your EC2 Instance**:
   ```sh
   ssh -i /path/to/your-key-pair.pem ec2-user@your-ec2-public-ip
   ```

2. **Navigate to Your Project Directory**:
   ```sh
   cd hackkakis-round2
   ```

3. **Pull the Latest Changes from Your Repository**:
   ```sh
   git pull
   ```

4. **Restart the Bot**:
   ```sh
   pm2 restart pathfinder-bot
   ```

## Usage

1. Start a conversation with your bot on Telegram.
2. Use the `/start` command to bring up the main menu.
3. Select "Plan Route" to plan a new route, "Help" for assistance, or "Provide Feedback" to rate your experience.

## Logging User Input

User inputs are logged in the `user_input.log` file, and feedback is logged in the `feedback.log` file.

## Error Handling

The bot includes basic error handling and will log polling errors to the console.

## Contributing

Feel free to open issues or submit pull requests if you have suggestions or improvements.

## License

This project is licensed under the MIT License.
