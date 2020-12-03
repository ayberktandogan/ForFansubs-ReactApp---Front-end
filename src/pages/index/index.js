import React, { useEffect, useState } from 'react'
import { useGlobal } from 'reactn'
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';

import axios from '../../config/axios/axios'
import { getIndexEpisodes, getIndexFeaturedAnime, getIndexBatchEpisodes } from '../../config/api-routes'

import { Grid, Typography } from '@material-ui/core'
import { IndexDivider, useStyles } from '../../components/index/index'
import LatestAniManga, { LoadingDivAniManga } from '../../components/index/latest/latestanimanga'
import LatestEpisode, { LoadingDivEpisode } from '../../components/index/latest/latestepisode';
import FeaturedContainer from '../../components/index/featured/FeaturedContainer'
import LatestBatchLinks from '../../components/index/latest/latestbatchlinks';
import LatestMangaEpisode, { LoadingDivMangaEpisode } from '../../components/index/latest/latestmangaepisode';
import MotdContainer from '../../components/motd';
import Metatags from '../../components/helmet/index'


export default function IndexPage(props) {
    const classes = useStyles()
    const { t } = useTranslation('pages');

    let latestAnimesWindow = []
    let latestMangasWindow = []
    let latestEpisodesWindow = []
    let latestMangaEpisodesWindow = []
    let batchEpisodesWindow = []

    const [latestAnimes, setLatestAnimes] = useState([])
    const [latestMangas, setLatestMangas] = useState([])
    const [latestEpisodes, setLatestEpisodes] = useState([])
    const [latestMangaEpisodes, setLatestMangaEpisodes] = useState([])
    const [featuredAnimes, setFeaturedAnimes] = useState([])
    const [batchEpisodes, setBatchEpisodes] = useState([])

    const [latestLoading, setLatestLoading] = useState(true)
    const [featuredLoading, setFeaturedLoading] = useState(true)
    const [batchLoading, setBatchLoading] = useState(true)
    const [mobile] = useGlobal('mobile')

    //Handle data fetch
    useEffect(() => {
        axios.get(getIndexEpisodes)
            .then(res => {
                setLatestAnimes(res.data.animes)
                setLatestMangas(res.data.mangas)
                setLatestEpisodes(res.data.episodes)
                setLatestMangaEpisodes(res.data.manga_episodes)
                setLatestLoading(false)
            })
            .catch(_ => {
                console.log("Son konular yüklenirken bir sorunla karşılaştık.")
            })
        axios.get(getIndexFeaturedAnime)
            .then(res => {
                setFeaturedAnimes(res.data)
                setFeaturedLoading(false)
            })
            .catch(_ => {
                console.log("Öne çıkarılmış animeleri yüklerken bir sorunla karşılaştık.")
            })
        axios.get(getIndexBatchEpisodes)
            .then(res => {
                setBatchEpisodes(res.data)
                setBatchLoading(false)
            })
            .catch(_ => {
                console.log("Toplu linkleri yüklerken bir sorunla karşılaştık.")
            })
        ReactGA.pageview(window.location.pathname)
    }, [mobile])

    if (latestLoading) {
        for (let i = 0; i < 24; i++) {
            latestAnimesWindow.push(LoadingDivAniManga(i + "loadingani"))
            latestMangasWindow.push(LoadingDivAniManga(i + "loadingman"))
        }
        for (let k = 0; k < 18; k++) {
            latestEpisodesWindow.push(LoadingDivEpisode(k + "loadingepi"))
            latestMangaEpisodesWindow.push(LoadingDivMangaEpisode(k + "loadingepi"))
        }
    }

    //Hande latest loading
    if (!latestLoading) {
        latestAnimesWindow = latestAnimes.map(anime => (
            <LatestAniManga type="anime" {...anime} key={anime.id + "anime"} />
        ))
        latestMangasWindow = latestMangas.map(manga => (
            <LatestAniManga type="manga" {...manga} key={manga.id + "manga"} />
        ))
        latestEpisodesWindow = latestEpisodes.map(episode => (
            <LatestEpisode {...episode} key={`${episode.anime_name} ${episode.episode_number} ${episode.special_type} episode`} />
        ))
        latestMangaEpisodesWindow = latestMangaEpisodes.map(episode => (
            <LatestMangaEpisode {...episode} key={episode.manga_name + episode.episode_number + "manga episode"} />
        ))
    }

    //Öne çıkarılmışlar yükleniyor...

    //Handle latest batch episodes
    batchEpisodesWindow = batchEpisodes.map(episode => <LatestBatchLinks
        loading={batchLoading}
        {...episode}
        key={episode.id + " batch"}
    />)


    return (
        <div className={classes.MainDiv}>
            <Metatags />
            <MotdContainer {...props} />
            <section className={classes.ContainerDiv}>
                <FeaturedContainer list={featuredAnimes} loading={featuredLoading} />
            </section>
            {
                batchEpisodesWindow.length ?
                    <section className={classes.ContainerDiv}>
                        <Typography variant="h4" component="h2" >
                            {t('index.batch_links.default')}
                        </Typography>
                        {t('index.batch_links.description') ?
                            <Typography variant="subtitle1" gutterBottom>
                                {t('index.batch_links.description')}
                            </Typography> : ""}
                        <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                            {batchEpisodesWindow}
                        </Grid>
                    </section>
                    : ""
            }
            <IndexDivider />
            {
                latestEpisodesWindow.length || latestAnimesWindow.length ?
                    <Typography variant="h2" component="h2">
                        {t('index.newest_anime.default')}
                    </Typography>
                    : ""
            }
            {
                latestEpisodesWindow.length ?
                    <section className={classes.ContainerDiv}>
                        <Typography variant="h4" gutterBottom>
                            {t('index.newest_anime_episodes.default')}
                        </Typography>
                        <div className={classes.EpisodeContainer}>
                            {latestEpisodesWindow}
                        </div>
                    </section>
                    : ""
            }
            <IndexDivider />
            {
                latestAnimesWindow.length ?
                    <section className={classes.ContainerDiv}>
                        {t('index.newest_anime.description') ?
                            <Typography variant="subtitle1" gutterBottom>
                                {t('index.newest_anime.description')}
                            </Typography> : ""}
                        <Grid container spacing={2} direction="row" justify="center">
                            {latestAnimesWindow}
                        </Grid>
                    </section>
                    : ""
            }
            <IndexDivider />
            {
                latestMangaEpisodesWindow.length || latestMangasWindow.length ?
                    <Typography variant="h2" component="h2" >
                        {t('index.newest_manga.default')}
                    </Typography>
                    : ""
            }
            {
                latestMangaEpisodesWindow.length ?
                    <section className={classes.ContainerDiv}>
                        <Typography variant="h4" gutterBottom>
                            {t('index.newest_manga_episodes.default')}
                        </Typography>
                        <div className={classes.EpisodeContainer}>
                            {latestMangaEpisodesWindow}
                        </div>
                    </section>
                    : ""
            }
            <IndexDivider />
            {
                latestMangasWindow.length ?
                    <section className={classes.ContainerDiv}>
                        {t('index.newest_manga.description') ?
                            <Typography variant="subtitle1" gutterBottom>
                                {t('index.newest_manga.description')}
                            </Typography> : ""}
                        <Grid container spacing={2} direction="row" justify="center" alignItems="stretch">
                            {latestMangasWindow}
                        </Grid>
                    </section>
                    : ""
            }
        </div>
    )
}