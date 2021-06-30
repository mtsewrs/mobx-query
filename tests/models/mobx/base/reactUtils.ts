/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { createStoreContext, createUseQueryHook } from '../../../../lib/mobx'
import * as React from 'react'
import { RootStore } from '../common/root'

export const StoreContext = createStoreContext<RootStore>(React)

export const useQuery = createUseQueryHook(StoreContext, React)