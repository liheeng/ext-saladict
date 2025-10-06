import React, { ComponentType, FC, useMemo, Suspense } from 'react'
import classNames from 'classnames'
import root from 'react-shadow'
import { Observable } from 'rxjs'
import { DictID } from '@/app-config'
import { Word } from '@/_helpers/record-manager'
import { SALADICT_PANEL } from '@/_helpers/saladict'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { StaticSpeakerContainer } from '@/components/Speaker'

const dictContentStyles = require('./DictItemContent.shadow.scss').toString()

export interface DictItemBodyProps {
  dictID: DictID

  darkMode: boolean
  withAnimation: boolean

  panelCSS: string

  searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  searchResult?: object | null

  catalogSelect$: Observable<{ key: string; value: string }>

  dictRootRef: React.MutableRefObject<HTMLDivElement | null>

  searchText: (arg?: {
    id?: DictID
    word?: Word
    payload?: { [index: string]: any }
  }) => any

  onSpeakerPlay: (src: string) => Promise<void>

  onInPanelSelect: (e: React.MouseEvent<HTMLElement>) => void
}

// FIXME: added by Henry Lee(liheeng@gmail.com), 20250507
// Since browser extension manifest v3, the security policy are updated, the dymamical scripts/css loading are forbidden.
// The dynamic loading of Dict View and CSS are changed to pre-load instead of dynamic loading.
// The View and CSS of all Dict View and CSS are loaded into array, and use dict id to identify them.
// The code change show below.

// const dictViewScriptContext = require.context(`@/components/dictionaries/`, true, /^\.\/[^\/]+\/.*\.tsx$/); // Updated regex for .tsx

// async function loadDictViewScript(dictId: string): Promise<any | null> {
//   const matchingModules = dictViewScriptContext.keys().filter(key => key.includes('/' + dictId + '/View.tsx'));;

//   if (matchingModules.length > 0) {
//     const module = dictViewScriptContext(matchingModules[0]); // Load the first match
//     console.log(`Loaded module: ${matchingModules[0]}`, module);
//     if (module.default) {
//       if (typeof module.default === 'function') {
//         module.default();
//       } else {
//         console.log('Loaded module has a default export:', module.default);
//       }
//     }
//     return module;
//   }

//   console.log(`No module found matching pattern: ${dictId}`);
//   return null;
// }

// dict views.tsx
const viewContext = require.context(
  `@/components/dictionaries`,
  true,
  /^\.\/[^/]+\/.*\.tsx$/
)

export const dictViews: Record<string, React.LazyExoticComponent<any>> = {}

viewContext.keys().forEach(key => {
  const dictID = String(key).split('/')[1] // assumes path like './<dictID>/View.tsx'
  console.info('Loading dictionary View.tsx:', dictID)
  dictViews[dictID] = React.lazy(() =>
    import(`@/components/dictionaries/${dictID}/View.tsx`)
  )
})

// dict views.tsx`@/components/dictionaries/${props.dictID}/_style.shadow.scss
const styleContext = require.context(
  `@/components/dictionaries`,
  true,
  /^\.\/[^/]+\/_style.shadow.scss$/
)

const styles: Record<string, string> = {}

styleContext.keys().forEach(key => {
  const dictID = String(key).split('/')[1] // './dictA/_style.shadow.scss'
  styles[dictID] = styleContext(key).default || styleContext(key) // compiled CSS string
})

export const DictItemBody: FC<DictItemBodyProps> = props => {
  const Dict = useMemo(
    () =>
      // React.lazy<ComponentType<ViewPorps<any>>>(() =>
      //   import(
      //     /* webpackInclude: /View\.tsx$/ */
      //     /* webpackMode: "lazy" */
      //     `@/components/dictionaries/${props.dictID}/View.tsx`
      //   )
      // ),
      dictViews[props.dictID],
    [props.dictID]
  )

  const DictStyle = useMemo(
    () =>
      React.lazy(async () => {
        // const styleModule = await import(
        //   /* webpackInclude: /_style\.shadow\.scss$/ */
        //   /* webpackMode: "lazy" */
        //   `@/components/dictionaries/${props.dictID}/_style.shadow.scss`
        // )
        // return {
        //   default: () => (
        //     <style>{(styleModule.default || styleModule).toString()}</style>
        //   )
        // }
        const style = styles[props.dictID]
        return {
          default: () => <style>{style}</style>
        }
      }),
    [props.dictID]
  )

  return (
    <ErrorBoundary error={DictRenderError}>
      <Suspense fallback={null}>
        {props.searchStatus === 'FINISH' && props.searchResult && (
          <root.div>
            <div
              ref={props.dictRootRef}
              className={classNames({ darkMode: props.darkMode })}
            >
              <style>{dictContentStyles}</style>
              <DictStyle />
              {props.panelCSS ? <style>{props.panelCSS}</style> : null}
              <StaticSpeakerContainer
                className={classNames(
                  `d-${props.dictID}`,
                  'dictRoot',
                  SALADICT_PANEL,
                  { isAnimate: props.withAnimation }
                )}
                onPlayStart={props.onSpeakerPlay}
                onMouseUp={props.onInPanelSelect}
              >
                <Dict
                  result={props.searchResult}
                  searchText={props.searchText}
                  catalogSelect$={props.catalogSelect$}
                />
              </StaticSpeakerContainer>
            </div>
          </root.div>
        )}
      </Suspense>
    </ErrorBoundary>
  )
}

function DictRenderError() {
  return (
    <p style={{ textAlign: 'center' }}>
      Render error. Please{' '}
      <a
        href="https://github.com/crimx/ext-saladict/issues"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        report issue
      </a>
      .
    </p>
  )
}
