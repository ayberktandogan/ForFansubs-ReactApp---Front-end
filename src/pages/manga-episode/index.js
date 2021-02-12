import { useEffect, useState, useRef, useContext } from 'react'
import Metatags from '../../components/helmet/index'
import ReactGA from 'react-ga'
import Find from 'lodash-es/find'

import { useStyles, defaultBoxProps } from '../../components/manga-episode/index'
import { getMangaEpisodePageInfo, mangaPageImage } from '../../config/api-routes'
import { Grid, Typography, Box, Button, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core'
import { NavigateNext, NavigateBefore, Image, BurstMode } from '@material-ui/icons'
import ContentWarning from '../../components/warningerrorbox/warning'
import DisqusBox from '../../components/disqus/disqus'
import MotdContainer from '../../components/motd'

import { mangaEpisodePage, mangaPage } from '../../config/front-routes'
import Loading from '../../components/progress'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cursorNext, cursorPrevious } from '../../config/theming/images'
import SettingsContext from '../../contexts/settings.context'
import getDataFromAPI from '../../helpers/getDataFromAPI'

export default function MangaEpisodePage(props) {
    const { t } = useTranslation(['pages', 'common'])
    const classes = useStyles()
    const [loading, setLoading] = useState(true)
    const [mangaData, setMangaData] = useState({
        manga_name: "",
        manga_slug: "",
        manga_cover: ""
    })
    const [episodeData, setEpisodeData] = useState([])
    const [activeEpisodeData, setActiveEpisodeData] = useState({
        id: null,
        manga_name: "",
        manga_cover: "",
        credits: "",
        created_by: "",
        episode_name: "",
        episode_number: "",
        pages: []
    })
    const [activePageNumber, setActivePageNumber] = useState(1)
    const [settings, setSettings] = useContext(SettingsContext)

    const NavigatorRef = useRef()

    useEffect(() => {
        const { slug, episode_number, page_number } = props.match.params

        const fetchData = async () => {
            let pageInfo

            setMangaData({
                manga_slug: slug,
            })

            try {
                pageInfo = await getDataFromAPI({ route: getMangaEpisodePageInfo(slug) })
            } catch (err) {
                return setLoading(false)
            }

            if (pageInfo.data.length === 0 || pageInfo.status !== 200) {
                return setLoading(false)
            }

            setMangaData(state => ({
                ...state,
                manga_name: pageInfo.data[0].manga_name,
                manga_cover: pageInfo.data[0].manga_cover
            }))

            if (episode_number) {
                const newData = Find(pageInfo.data, { episode_number: episode_number })
                if (newData) {
                    const pages = newData.pages
                    setActiveEpisodeData(state => ({ ...state, ...newData, pages: pages }))
                    // Gelen sayfa numarası, var olan sayfalara uyuşuyor mu bak. Çok büyük
                    // ya da çok küçükse varolan değeri ata.
                    setActivePageNumber(state => (
                        page_number <= pages.length && page_number >= 1 ? Number(page_number) : state
                    ))
                }
            }

            setEpisodeData(pageInfo.data)
            setLoading(false)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const { slug } = props.match.params

        window.history.replaceState("", "", mangaEpisodePage(slug, activeEpisodeData.episode_number, activePageNumber))
        ReactGA.pageview(window.location.pathname)
        // eslint-disable-next-line
    }, [activeEpisodeData, activePageNumber])

    function handleChange(event) {
        setActivePageNumber(1)
        const newData = Find(episodeData, { episode_number: event.target.value })
        setActiveEpisodeData(state => ({ ...state, ...newData, pages: newData.pages }));
    }

    function handleNavigateBeforeButton() {
        setActivePageNumber(state => (
            state === 1 ? 1 : state - 1
        ))
    }

    function handleNavigateNextButton() {
        setActivePageNumber(state => (
            state === activeEpisodeData.pages.length ? state : state + 1
        ))
    }

    function handleReadingStyleChangeButton() {
        // İki tür var. "pagebypage" ve "webtoon"
        if (settings.readingStyle === "pagebypage") setSettings(state => ({ ...state, readingStyle: "webtoon" }))
        else setSettings(state => ({ ...state, readingStyle: "pagebypage" }))
    }

    function handleCenteringPage() {
        // Header için 64 height ekle
        const offset = NavigatorRef.current.clientHeight + 48
        document.getElementById('scroll-node').scrollTo({
            top: offset
        })
    }

    if (!loading && episodeData.length !== 0) {
        return (
            <>
                <Metatags title={
                    t('manga_episode.metadata.title',
                        {
                            manga_name: mangaData.manga_name,
                            episode_number: activeEpisodeData.episode_number,
                            site_name: process.env.REACT_APP_SITENAME,
                            count: Boolean(activeEpisodeData.episode_number) ? 1 : 2
                        })}
                    desc={
                        t('manga_episode.metadata.description',
                            {
                                manga_name: mangaData.manga_name,
                                episode_number: activeEpisodeData.episode_number,
                                site_name: process.env.REACT_APP_SITENAME,
                                count: Boolean(activeEpisodeData.episode_number) ? 1 : 2
                            })}
                    url={process.env.REACT_APP_SITEURL + mangaEpisodePage(props.match.params.slug, mangaData.slug)}
                    content="books.book"
                    image={mangaData.manga_cover} />
                <Grid container spacing={2} justify="center" className={classes.Container}>
                    <Grid item xs={12}>
                        <MotdContainer {...props} content_type="manga-episode" content_id={activeEpisodeData.id} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box className={classes.Navigator} ref={NavigatorRef}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="episode-selector">{t('manga_episode.warnings.select_the_episode_you_wish_to_read')}</InputLabel>
                                <Select
                                    fullWidth
                                    value={`${activeEpisodeData.episode_number}`}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: "episode",
                                        id: "episode-selector"
                                    }}
                                >
                                    {episodeData.map(d => <MenuItem key={d.episode_number} value={`${d.episode_number}`}>{t('common:episode.episode_title', { episode_number: d.episode_number })}{d.episode_name ? `: ${d.episode_name}` : ""}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <div className={classes.ReadingStyleButtonContainer}>
                                <Button
                                    className={classes.PagebyPage}
                                    variant="outlined"
                                    onClick={handleReadingStyleChangeButton}>
                                    {settings.readingStyle === "pagebypage" ?
                                        <><BurstMode />{t('common:buttons.webtoon')}</>
                                        :
                                        <><Image />{t('common:buttons.pagebypage')}</>
                                    }
                                </Button>
                                <Link to={mangaPage(mangaData.manga_slug)}>
                                    <Button
                                        className={classes.ToManga}
                                        variant="outlined"
                                    >
                                        {t('common:buttons.goto_manga')}
                                    </Button>
                                </Link>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <div className={classes.ImageContainer}>
                            {activeEpisodeData.episode_number
                                ?
                                settings.readingStyle === "pagebypage" ?
                                    <>
                                        <img
                                            className={classes.MainPageImage}
                                            src={mangaPageImage(mangaData.manga_slug, activeEpisodeData.episode_number, activeEpisodeData.pages[(activePageNumber - 1)].filename)}
                                            alt={t('manga_episode.img_alt', { manga_name: mangaData.manga_name, episode_number: activeEpisodeData.episode_number, page_number: activePageNumber })}
                                            onLoad={_ => {
                                                handleCenteringPage()
                                            }} />
                                        <div className={classes.ImageOverlayContainer}>
                                            {activePageNumber !== 1 && activeEpisodeData.episode_number ? <div
                                                className={classes.ImageOverlay}
                                                style={{ cursor: `url(${cursorPrevious}), crosshair` }}
                                                onClick={handleNavigateBeforeButton}
                                                title={t('manga_episode.previous_page')}
                                            /> : ""}
                                            {activePageNumber !== activeEpisodeData.pages.length && activeEpisodeData.episode_number ? <div
                                                className={classes.ImageOverlay}
                                                style={{ cursor: `url(${cursorNext}), crosshair` }}
                                                onClick={handleNavigateNextButton}
                                                title={t('manga_episode.next_page')} /> : ""}
                                        </div>
                                    </>
                                    :
                                    <div className={classes.WebtoonContainer}>
                                        {activeEpisodeData.pages.map((page, index) => (
                                            <img
                                                key={page.filename}
                                                loading="lazy"
                                                className={classes.MainPageImage}
                                                width="900px"
                                                height="1270px"
                                                src={mangaPageImage(mangaData.manga_slug, activeEpisodeData.episode_number, page.filename)}
                                                alt={t('manga_episode.img_alt', { manga_name: mangaData.manga_name, episode_number: activeEpisodeData.episode_number, page_number: index + 1 })} />
                                        ))}
                                    </div>
                                :
                                <ContentWarning
                                    {...defaultBoxProps}
                                    p={1}>
                                    {t('manga_episode.warnings.please_select_episode')}
                                </ContentWarning>
                            }
                        </div>
                    </Grid>
                    {activeEpisodeData.episode_number ?
                        <Grid item xs={12}>
                            <Box {...defaultBoxProps} p={2}>
                                <DisqusBox
                                    withButton
                                    config={{ identifier: `manga/${mangaData.manga_slug}/${activeEpisodeData.episode_number}` }} />
                            </Box>
                        </Grid>
                        : ""}
                </Grid>
            </>
        )
    }

    else if (!loading) {
        return (
            <>
                <Grid container>
                    <Typography variant="h1">{t('manga_episode.warnings.no_episode_data')}</Typography>
                </Grid>
            </>
        )
    }

    else {
        return (
            <Loading />
        )
    }
}