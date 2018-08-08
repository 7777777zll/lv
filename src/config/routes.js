/**
 * Created by zhaolili on 2018/1/23.
 */
// 引用模板
import indexNew from '../components/indexNew.vue'
import storageDetailNew from '../components/storageDetailNew.vue'
import inStorageNew from '../components/inStorageNew.vue'
import outStorageNew from '../components/outStorageNew.vue'
import manOutStorageNew from '../components/manOutStorageNew.vue'
import rebackNew from '../components/rebackNew.vue'
import kfChoose from '../components/kfChoose.vue'
import loginNew from '../components/loginNew.vue'
import alertTipNew from '../components/alertTipNew.vue'
import tableNoData from '../components/tableNoData.vue'
import finishTipNew from '../components/finishTipNew.vue'
import recoveryNew from '../components/recoveryNew.vue'
import metarialDetailNew from '../components/metarialDetailNew.vue'
import Error404 from '../components/error_404.vue'
// 配置路由
export default [
  {
    path: '/',
    component: indexNew
  },
  {
    path: '/storageDetailNew',
    component: storageDetailNew
  },
  {
    path: '/inStorageNew',
    component: inStorageNew
  },
  {
    path: '/outStorageNew',
    component: outStorageNew
  },
  {
    path: '/manOutStorageNew',
    component: manOutStorageNew
  },
  {
    path: '/rebackNew',
    component: rebackNew
  },
  {
    path: '/kfChoose',
    component: kfChoose
  },
  {
    path: '/loginNew',
    component: loginNew
  },
  {
    path: '/alertTipNew',
    component: alertTipNew
  },
  {
    path: '/tableNoData',
    component: tableNoData
  },
  {
    path: '/finishTipNew',
    component: finishTipNew
  },
  {
    path: '/recoveryNew',
    component: recoveryNew
  },
  {
    path: '/metarialDetailNew/:cstCode/:departmentCode',
    component: metarialDetailNew
  },
  { path: '/404',
    component: Error404,
  }
]
