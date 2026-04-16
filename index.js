#!/usr/bin/env node

/**
 * CommitHub CLI Entry Point
 * Handles command parsing and routes to appropriate handlers
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const awsConfig = require('./config/aws-config');

const COMMITHUB_DIR = '.CommitHub';
const COMMITS_DIR = path.join(COMMITHUB_DIR, 'commits');
const BRANCHES_DIR = path.join(COMMITHUB_DIR, 'branches');
const HEAD_FILE = path.join(COMMITHUB_DIR, 'HEAD');
const CONFIG_FILE = path.join(COMMITHUB_DIR, 'config.json');

/**
 * Initialize a new CommitHub repository in the current directory
 */
function init() {
  if (fs.existsSync(COMMITHUB_DIR)) {
    console.log('Repository already initialized.');
    return;
  }

  fs.mkdirSync(COMMITS_DIR, { recursive: true });
  fs.mkdirSync(BRANCHES_DIR, { recursive: true });

  fs.writeFileSync(HEAD_FILE, 'main');
  fs.writeFileSync(path.join(BRANCHES_DIR, 'main'), '');

  const config = {
    version: '1.0.0',
    created: new Date().toISOString(),
    remote: null
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

  console.log('Initialized empty CommitHub repository.');
}

/**
 * Create a new commit with the given message, saving all tracked files
 * @param {string} message - Commit message
 */
function commit(message) {
  if (!message) {
    console.error('Error: commit message is required.');
    process.exit(1);
  }

  const commitId = uuidv4();
  const commitDir = path.join(COMMITS_DIR, commitId);
  fs.mkdirSync(commitDir, { recursive: true });

  const branch = fs.readFileSync(HEAD_FILE, 'utf-8').trim();
  const branchFile = path.join(BRANCHES_DIR, branch);
  const parentCommit = fs.existsSync(branchFile)
    ? fs.readFileSync(branchFile, 'utf-8').trim()
    : null;

  const commitData = {
    id: commitId,
    message,
    timestamp: new Date().toISOString(),
    branch,
    parent: parentCommit || null,
    author: process.env.COMMITHUB_USER || 'unknown'
  };

  fs.writeFileSync(
    path.join(commitDir, 'commit.json'),
    JSON.stringify(commitData, null, 2)
  );

  // Copy index.js snapshot into commit folder as a simple file snapshot
  if (fs.existsSync('index.js')) {
    fs.copyFileSync('index.js', path.join(commitDir, 'index.js'));
  }

  fs.writeFileSync(branchFile, commitId);

  console.log(`[${branch}] ${commitId.slice(0, 8)} ${message}`);
}

/**
 * Display commit log for the current branch
 */
function log() {
  const branch = fs.readFileSync(HEAD_FILE, 'utf-8').trim();
  const branchFile = path.join(BRANCHES_DIR, branch);

  if (!fs.existsSync(branchFile) || !fs.readFileSync(branchFile, 'utf-8').trim()) {
    console.log('No commits yet.');
    return;
  }

  let commitId = fs.readFileSync(branchFile, 'utf-8').trim();

  while (commitId) {
    const commitFile = path.join(COMMITS_DIR, commitId, 'commit.json');
    if (!fs.existsSync(commitFile)) break;

    const data = JSON.parse(fs.readFileSync(commitFile, 'utf-8'));
    console.log(`commit ${data.id}`);
    console.log(`Author: ${data.author}`);
    console.log(`Date:   ${data.timestamp}`);
    console.log(`\n    ${data.message}\n`);

    commitId = data.parent;
  }
}

// CLI argument parsing
const [,, command, ...args] = process.argv;

switch (command) {
  case 'init':
    init();
    break;
  case 'commit':
    commit(args.join(' '));
    break;
  case 'log':
    log();
    break;
  default:
    console.log('Usage: commithub <init|commit|log> [args]');
}
