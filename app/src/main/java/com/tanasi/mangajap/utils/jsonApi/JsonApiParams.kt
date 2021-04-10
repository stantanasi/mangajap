package com.tanasi.mangajap.utils.jsonApi

class JsonApiParams(
        include: List<String>? = null,
        fields: Map<String, List<String>>? = null,
        sort: List<String>? = null,
        limit: Int? = null,
        offset: Int? = null,
        filter: Map<String, List<String>>? = null
) : Map<String, String> {

    private val queryMap: MutableMap<String, String> = mutableMapOf()

    init {
        include?.let { queryMap.put("include", it.joinToString(",")) }
        fields?.map { queryMap.put("fields[${it.key}]", it.value.joinToString(",")) }
        sort?.let { queryMap.put("sort", it.joinToString(",")) }
        limit?.let { queryMap.put("page[limit]", it.toString()) }
        offset?.let { queryMap.put("page[offset]", it.toString()) }
        filter?.map { queryMap.put("filter[${it.key}]", it.value.joinToString(",")) }
    }


    override val entries: Set<Map.Entry<String, String>>
        get() = queryMap.entries
    override val keys: Set<String>
        get() = queryMap.keys
    override val size: Int
        get() = queryMap.size
    override val values: Collection<String>
        get() = queryMap.values

    override fun containsKey(key: String): Boolean = queryMap.containsKey(key)

    override fun containsValue(value: String): Boolean = queryMap.containsValue(value)

    override fun get(key: String): String? = queryMap[key]

    override fun isEmpty(): Boolean = queryMap.isEmpty()
}