using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Linq.Dynamic.Core;

namespace CuttingVaultApi.Database
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly CuttingVaultDbContext _Context;
        protected readonly DbSet<T> _DbSet;

        public Repository(CuttingVaultDbContext context)
        {
            _Context = context;
            _DbSet = context.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            return _DbSet.ToList();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _DbSet.ToListAsync();
        }

        public T GetById(int id)
        {
            return _DbSet.Find(id);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _DbSet.FindAsync(id);
        }

        public void Insert(T entity)
        {
            _DbSet.Add(entity);
        }

        public void Update(T entity)
        {
            _Context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(int id)
        {
            T entity = _DbSet.Find(id);
            if (entity != null)
            {
                _DbSet.Remove(entity);
            }
        }

        public void Save()
        {
            _Context.SaveChanges();
        }

        public Task SaveAsync()
        {
            return _Context.SaveChangesAsync();
        }

        public PagedSet<T> GetPage(int pageNumber, int itemsPerPage, string orderBy = "", bool desc = false)
        {
            var startItem = pageNumber * itemsPerPage - itemsPerPage;
            var query = _DbSet.Skip(startItem).Take(itemsPerPage);
            var q = query.ToQueryString();

            var result = new PagedSet<T>()
            {
                TotalCount = _DbSet.Count(),
                ItemsPerPage = itemsPerPage,
                PageNumber = pageNumber,
                Page = query.ToList()
            };

            return result;
        }

        public async Task<PagedSet<T>> GetPageAsync(int pageNumber, int itemsPerPage, string orderBy = "", bool desc = false)
        {
            var asc = desc ? "descending" : "ascending"; 
            var startItem = pageNumber * itemsPerPage - itemsPerPage;
            var query = _DbSet.OrderBy($"{orderBy} {asc}").Skip(startItem).Take(itemsPerPage);
            var q = query.ToQueryString();

            var result = new PagedSet<T>()
            {
                TotalCount = _DbSet.Count(),
                ItemsPerPage = itemsPerPage,
                PageNumber = pageNumber,
                Page = await query.ToListAsync()
            };

            return result;
        }
    }
}
