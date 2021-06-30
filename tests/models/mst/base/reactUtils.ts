/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { createStoreContext, createUseQueryHook } from '../../../../lib/mst'
import * as React from 'react'
import { RootStoreType } from '../common/root'

export const StoreContext = createStoreContext<RootStoreType>(React)

export const useQuery = createUseQueryHook(StoreContext, React)