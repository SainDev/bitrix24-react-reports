import { apiParams } from "../settings";

const hashstr = s => {
    let hash = 0;
    if (s.length == 0) return hash;
    for (let i = 0; i < s.length; i++) {
        let char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

const cachedFetch = async (url, options) => {
    let expiry = (process.env.NODE_ENV === 'production' ? 30 : 100.01) * 60 // 30 min default
    if (typeof options === 'number') {
        expiry = options
        options = undefined
    } else if (typeof options === 'object') {
        expiry = options.seconds || expiry
    }
    let cacheKey = hashstr(url)
    let cached = localStorage.getItem(cacheKey)
    let whenCached = localStorage.getItem(cacheKey + ':ts')
    if (cached !== null && whenCached !== null) {
        let age = (Date.now() - whenCached) / 1000
        if (!navigator.onLine || age < expiry) {
            let response = new Response(new Blob([cached]))
            return Promise.resolve(response)
        } else {
            localStorage.removeItem(cacheKey)
            localStorage.removeItem(cacheKey + ':ts')
        }
    }

    const response_1 = await fetch(url, options);
    if (response_1.status === 200) {
        let ct = response_1.headers.get('Content-Type');
        if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
            response_1.clone().text().then(content => {
                localStorage.setItem(cacheKey, content);
                localStorage.setItem(cacheKey + ':ts', Date.now());
            });
        }
    }

    return response_1;
}

async function getDeals (props) {
    const r = await cachedFetch(apiParams.apiUrl + apiParams.apiKey
        + '/crm.deal.list/?order[BEGINDATE]=ASC&filter[%3EBEGINDATE]='
        + props.beginDate
        + '&filter[%3CCLOSEDATE]='
        + props.closeDate
        + '&filter[COMPANY_ID]='
        + localStorage.getItem('cId'))
        .then(res => res.json(), (error) => {
            return {
                error: error
            }
        });

    return await r;
}

async function getTasks (deals) {
    if (deals.total > 0) {
        const promises = deals.result.map(async (item) => {
            const response = await cachedFetch(apiParams.apiUrl + apiParams.apiKey
                + '/tasks.task.list/?order[REAL_STATUS]=ASC&filter[UF_CRM_TASK]=D_'
                + item.ID
                + '&select[]=UF_CRM_TASK&select[]=TIME_SPENT_IN_LOGS&select[]=ID&select[]=TITLE&select[]=REAL_STATUS');
            return await response.json();
        });

        return Promise.all(promises).then(results => results.map(result => result.result.tasks), (error) => {
            return {
                error: error
            }
        })
    } else {
        return []
    }
}

async function processingData (props) {
    let deals = await getDeals(props)
    let tasks = await getTasks(deals)

    if (deals.error) {
        return deals;
    }
    if (tasks.error) {
        return tasks;
    }

    let table = props.table;
    table.data = [];
    table.payed = false;

    if (deals.total > 0) {
        table.payed = true;

        deals.result.map((deal) => {
            if (deal.STAGE_ID.localeCompare('WON') !== 0) {
                table.payed = false;
            }

            let dealData = {
                tasks: [],
                timeFull: 0,
            }
  
            let dealTasks = []
            tasks.map(item => {
                if (item[0]['ufCrmTask'].includes('D_' + deal.ID)) {
                    dealTasks = item;
                    return;
                }
            })
            dealTasks.map((task) => {
                if (task.timeSpentInLogs) {
                    dealData.timeFull += parseInt(task.timeSpentInLogs);
                }
                dealData.tasks.push({
                    id: task.id,
                    name: task.title.replace('CRM: ', '').trim(),
                    time: task.timeSpentInLogs ? new Date(task.timeSpentInLogs * 1000).toISOString().substr(11, 8) : null,
                    status: task.status,
                });
            });

            let dealDate = new Date(deal.CLOSEDATE).getFullYear();

            dealData.hours = dealData.timeFull/3600;
            dealData.priceByHours = dealData.hours <= 0 || deal.TITLE.trim().substr(0, 9).localeCompare('Поддержка') == 0 ?
                    parseInt(deal.OPPORTUNITY)
                :
                    //Округление до десятков
                    Math.round((dealData.hours * parseInt(dealDate > 2020 ? props.hoursRate + 100 : props.hoursRate)) / 10) * 10
                ;

            table.data.push({
                id: deal.ID,
                name: deal.TITLE.trim(),
                price: parseInt(deal.OPPORTUNITY),
                complete: deal.STAGE_ID.localeCompare('WON') !== 0 ? false : true,
                ...dealData
            })
        });
    }

    return await table;
}

export default function fetchData (props) {
    return processingData(props)
}