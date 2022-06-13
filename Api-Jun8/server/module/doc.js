/**
 * @apiDefine authRequest
 * @apiHeader {String}    Authorization       Authorization token
 * @apiHeaderExample {json} Example:
 *     {
 *       "Authorization": "Bearer abcxyz1234"
 *     }
 */

/**
 * @apiDefine paginationQuery
 * @apiParam {Number} [take] total items will be responsed
 * @apiParam {Number} [page]
 * @apiParam {String} [sort] Sort field. Eg `createdAt`
 * @apiParam {String} [sortType] `desc` or `asc`
 */
