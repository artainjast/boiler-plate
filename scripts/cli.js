#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Helper to print colored text with chalk
function log(text, style = 'white') {
  if (typeof style === 'string') {
    console.log(chalk[style](text));
  } else {
    // For complex styling like chalk.bold.cyan
    console.log(style(text));
  }
}

// Helper to print banner
function printBanner() {
  console.clear();
  log(
    '╔══════════════════════════════════════════════════════════════════╗',
    chalk.bold.cyan,
  );
  log(
    '║                         🚀 BiziLink CLI                         ║',
    chalk.bold.cyan,
  );
  log(
    '║                    Interactive Project Manager                   ║',
    chalk.bold.cyan,
  );
  log(
    '╚══════════════════════════════════════════════════════════════════╝',
    chalk.bold.cyan,
  );
  console.log();
}

// Helper to execute commands
function executeCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    log(`\n🔄 Executing: ${command} ${args.join(' ')}`, chalk.yellow);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`\n✅ Command completed successfully!`, chalk.bold.green);
        resolve(code);
      } else {
        log(`\n❌ Command failed with exit code ${code}`, chalk.bold.red);
        reject(code);
      }
    });

    child.on('error', (error) => {
      log(`\n❌ Error executing command: ${error.message}`, chalk.bold.red);
      reject(error);
    });
  });
}

// Helper to ask questions with arrow key navigation
async function askSelect(message, choices) {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: chalk.bold.cyan(message),
      choices: choices.map((choice) => ({
        name: choice.label,
        value: choice,
      })),
      pageSize: choices.length,
    },
  ]);
  return choice;
}

// Helper to ask yes/no questions
async function askConfirm(message) {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.bold.cyan(message),
      default: true,
    },
  ]);
  return confirmed;
}

// Main CLI logic
async function main() {
  try {
    printBanner();

    // 1. Ask for environment
    const envChoice = await askSelect('🌍 Which environment would you like to run?', [
      {
        label: '🚀 Development (Hot reload, dev server on port 4100)',
        value: 'dev',
        command: 'pnpm',
        args: ['dev'],
      },
      {
        label: '🏗️  Build (Production build)',
        value: 'build',
        command: 'pnpm',
        args: ['build'],
      },
      {
        label: '⚡ Start (Production server on port 4100)',
        value: 'start',
        command: 'pnpm',
        args: ['start'],
      },
      {
        label: '🔧 Lint (Code linting with auto-fix)',
        value: 'lint',
        command: 'pnpm',
        args: ['lint'],
      },
      {
        label: '💅 Format (Code formatting)',
        value: 'format',
        command: 'pnpm',
        args: ['run', 'format:fix'],
      },
    ]);

    console.log();

    // 2. Ask about API generation
    const shouldGenerateAPI = await askConfirm(
      '🔌 Do you want to generate APIs before running?',
    );

    console.log();

    // 3. Show summary
    log('📋 Summary:', chalk.bold.white);
    log(`   Environment: ${chalk.cyan(envChoice.label)}`, chalk.gray);
    log(
      `   Generate APIs: ${shouldGenerateAPI ? chalk.green('✅ Yes') : chalk.red('❌ No')}`,
      chalk.gray,
    );
    console.log();

    const shouldProceed = await askConfirm('🚀 Proceed with these settings?');
    if (!shouldProceed) {
      log('❌ Operation cancelled.', chalk.bold.red);
      return;
    }

    console.log();
    log('🎯 Starting execution...', chalk.bold.green);

    // 4. Execute API generation if requested
    if (shouldGenerateAPI) {
      log('\n📡 Generating APIs with smart camelCase transformation...', 'cyan');
      await executeCommand('pnpm', ['run', 'generate:api']);
    }

    // 5. Execute the chosen environment command
    log(`\n🚀 Starting ${envChoice.label}...`, 'cyan');

    if (envChoice.value === 'build') {
      await executeCommand(envChoice.command, envChoice.args);
      log(
        '\n�� Build completed! You can now run "pnpm start" to serve the production build.',
        'green',
      );
    } else if (envChoice.value === 'format') {
      await executeCommand(envChoice.command, envChoice.args);
      log('\n🎉 Code formatting completed!', 'green');
    } else {
      // For dev, start, lint - run the command (will keep running)
      await executeCommand(envChoice.command, envChoice.args);
    }
  } catch (error) {
    log(`\n💥 An error occurred: ${error}`, chalk.bold.red);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n\n👋 Goodbye!', chalk.bold.yellow);
  process.exit(0);
});

// Start the CLI
if (require.main === module) {
  main();
}
