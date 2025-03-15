using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace CuttingVaultApi
{
    public struct PagedSet<T> where T : class
    {
        public IEnumerable<T> Page { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int ItemsPerPage { get; set; }
    }

    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        Task<IEnumerable<T>> GetAllAsync();
        T GetById(int id);
        Task<T> GetByIdAsync(int id);
        void Insert(T entity);
        void Update(T entity);
        void Delete(int id);
        void DeleteRange(T[] items);
        void DeleteRange(int[] ids);
        void Save();
        Task SaveAsync();
        PagedSet<T> GetPage(int pageNumber, int itemsPerPage, string orderBy, bool ascending);
        Task<PagedSet<T>> GetPageAsync(int pageNumber, int itemsPerPage, string orderBy, bool ascending);
    }
}
