using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Mysqlx.Crud;
using System.Linq.Dynamic.Core;

namespace CuttingVaultApi.Database
{
    interface IDbo
    {
        int Id { get; set; }
    }
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly CuttingVaultDbContext _context;
        protected readonly DbSet<T> _dbSet;
        private readonly ILogger _logger;

        public Repository(CuttingVaultDbContext context, ILogger logger)
        {
            _context = context;
            _dbSet = context.Set<T>();
            _logger = logger;
        }

        public IEnumerable<T> GetAll()
        {
            return _dbSet.ToList();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public T GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public void Insert(T entity)
        {
            _dbSet.Add(entity);
        }

        public void Update(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(int id)
        {
            T entity = _dbSet.Find(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }
        public void DeleteRange(T[] items)
        {
            _dbSet.RemoveRange(items);
        }

        public void DeleteRange(int[] idsToDelete)
        {
            var entitiesToDelete = new List<T>();
            foreach (var id in idsToDelete)
            {
                var item = _dbSet.Find(id);
                if (item != null)
                    entitiesToDelete.Add(item);
            }
            // Delete the filtered entities
            _dbSet.RemoveRange(entitiesToDelete);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public Task SaveAsync()
        {
            return _context.SaveChangesAsync();
        }

        public PagedSet<T> GetPage(int pageNumber, int itemsPerPage, string orderBy, bool ascending, string filters)
        {
            return default;
        }

        public async Task<PagedSet<T>> GetPageAsync(int pageNumber, int itemsPerPage, string orderBy, bool ascending, string filters)
        {
            var queryData = await GetQuery(pageNumber, itemsPerPage, orderBy, ascending, filters);

            var result = new PagedSet<T>()
            {
                TotalCount = queryData.Item2,
                ItemsPerPage = itemsPerPage,
                PageNumber = pageNumber,
                Page = await queryData.Item1.ToListAsync()
            };

            return result;
        }

        private async Task<(IQueryable<T>, int)> GetQuery(int pageNumber, int itemsPerPage, string orderBy, bool ascending, string filters)
        {
            var direction = ascending ? "ASC" : "DESC";
            var startItem = pageNumber * itemsPerPage - itemsPerPage;
            var query1 = _dbSet.FromSqlRaw($"SELECT * FROM `Customer` {GetFilters(filters)} ORDER BY `{orderBy}` {direction} LIMIT {itemsPerPage} OFFSET {pageNumber * itemsPerPage}");
            var q = query1.ToQueryString();
            _logger.LogDebug(q);

            var query2 = _dbSet.FromSqlRaw($"SELECT * FROM `Customer` {GetFilters(filters)}");
            q = query2.ToQueryString();
            _logger.LogDebug(q);

            var count = await query2.CountAsync();

            return (query1, count);
        }
        private String GetFilters(String items)
        {
            var whereClause = "where 1=1";
            if (items != null)
            {
                var filters = items.Split("@");
                foreach (var filter in filters)
                {
                    var item = filter.Split("~");
                    switch (item[1])
                    {
                        case "contains": whereClause += $" and {item[0]} like '%{item[2]}%'"; break;
                        case "doesNotContain": whereClause += $" and {item[0]} not like '%{item[2]}%'"; break;
                        case "equals": whereClause += $" and {item[0]} = '{item[2]}'"; break;
                        case "doesNotEqual": whereClause += $" and {item[0]} <> '{item[2]}'"; break;
                        case "startsWith": whereClause += $" and {item[0]} like '{item[2]}%'"; break;
                        case "endsWith": whereClause += $" and {item[0]} like '%{item[2]}'"; break;
                        case "isEmpty": whereClause += $" and {item[0]} = ''"; break;
                        case "isNotEmpty": whereClause += $" and {item[0]} <> ''"; break;
                        default: break;
                    }
                }
            }

            return whereClause;
        }
    }
}
