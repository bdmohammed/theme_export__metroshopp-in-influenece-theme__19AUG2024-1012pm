# theme_metroshopp_housequip

## Overview
This project is a Shopify theme named `theme_metroshopp_housequip`. It includes various assets, configurations, and templates necessary for building a fully functional Shopify store.

## Project Structure
```
theme_metroshopp_housequip
├── assets
│      ├── styles.css         # CSS styles for the theme
│      └── scripts.js         # JavaScript code for the theme
├── config                    # Configuration files for different environments
├── layout                    # Layout files defining the structure of pages
├── locales                   # Localization files for multi-language support
├── sections                  # Reusable components within the theme
├── snippets                  # Reusable pieces of code
├── templates                 # Template files for different pages
├── .eslintrc.json            # ESLint configuration for JavaScript linting
├── .prettierrc               # Prettier configuration for code formatting
├── .stylelintrc.json         # Stylelint configuration for CSS linting
├── sonar-project.properties  # SonarQube configuration for code quality analysis
├── package.json              # npm configuration file
├── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- A Shopify account to deploy the theme.

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/bdmohammed/theme_metroshopp_housequip.git
   ```
2. Navigate to the project directory:
   ```
   cd theme_metroshopp_housequip
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Scripts
- **Linting**: Run the following command to lint the code:
  ```
  npm run lint
  ```
- **Lint and Fix**: To automatically fix linting issues, use:
  ```
  npm run lint:fix
  ```
- **Testing**: Currently, no tests are specified. You can add your own tests as needed.

### Code Quality
This project uses ESLint for JavaScript, Stylelint for CSS, and Prettier for code formatting. Additionally, SonarQube is configured to analyze code quality.

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License
This project is licensed under the ISC License.