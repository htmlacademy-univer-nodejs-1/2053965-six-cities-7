#!/usr/bin/env node

import 'reflect-metadata';
import {Application, container} from './app/index.js';
import {Component} from './shared/types/index.js';

const application = container.get<Application>(Component.Application);

application.init();
